import { useEffect, useState } from "react"
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  useBalance,
  useContractRead
} from "wagmi"
import { BigNumber, ethers } from "ethers"
import { Box, Typography, Modal } from "@mui/material"
import { MULTIPLY_GAS_LIMIT } from "config"
import { multiplyBigNumberByFloat, formatEtherFixed } from "utils/numbers"
import TokenView from "components/TokenView"
import useWindowSize from "hooks/useWindowSize"
import MintingButton from "components/MintingButton"
import GenArt721MintV2ABI from "abi/V2/GenArt721MintV2.json"
import GenArt721CoreV2ABI from "abi/V2/GenArt721CoreV2.json"
import ERC20ABI from "abi/ERC20.json"

interface Props {
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  priceWei: BigNumber,
  currencySymbol: string,
  currencyAddress: string,
  isConnected: boolean,
  artistCanMint: boolean,
  anyoneCanMint: boolean,
  scriptAspectRatio: number,
  isPaused: boolean,
  isSoldOut: boolean
}

const GenArt721MinterButton = (
  {
    coreContractAddress,
    mintContractAddress,
    projectId,
    priceWei,
    currencySymbol,
    currencyAddress,
    isConnected,
    artistCanMint,
    anyoneCanMint,
    scriptAspectRatio,
    isPaused,
    isSoldOut
  }: Props
) => {

  const windowSize = useWindowSize()
  const [dialog, setDialog] = useState("")
  const [mintingTokenId, setMintingTokenId] = useState<any | null>(null)
  const [mintingPreview, setMintingPreview] = useState(false)
  const handleMintingPreviewOpen = () => setMintingPreview(true)
  const handleMintingPreviewClose = () => setMintingPreview(false)

  const projectUsesErc20 = currencyAddress !== "0x0000000000000000000000000000000000000000"

  const account = useAccount()
  const ethBalance = useBalance({
    address: account.address
  })
  const erc20Balance = useBalance({
    address: account.address,
    token: projectUsesErc20 ? currencyAddress as `0x${string}` : undefined
  })
  const [isAllowanceVerified, setIsAllowanceVerified] = useState(!projectUsesErc20)
  const [isBalanceVerified, setIsBalanceVerified] = useState(false)

  useContractRead({
    address: currencyAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: "allowance",
    args: [account.address, mintContractAddress],
    watch: true,
    enabled: !isPaused && !isSoldOut && projectUsesErc20,
    onSuccess(data: BigNumber) {
      setIsAllowanceVerified(data >= priceWei)
    }
  })

  useEffect(() => {
    if (projectUsesErc20) {
      if (erc20Balance?.data?.value.gt(priceWei)) {
        setIsBalanceVerified(true)
      }
    } else {
      if (ethBalance?.data?.value.gt(priceWei)) {
        setIsBalanceVerified(true)
      }
    }
  }, [erc20Balance, ethBalance])

  const erc20PrepareApprove = usePrepareContractWrite({
    address: currencyAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: "approve",
    enabled: (!isPaused || artistCanMint) && !isSoldOut && projectUsesErc20 && !isAllowanceVerified && isBalanceVerified,
    args: [
      mintContractAddress, BigNumber.from(priceWei)
    ]
  })
  const erc20WriteApprove = useContractWrite({
    ...erc20PrepareApprove.config,
    onSuccess() {
      setDialog("Approving ERC20...")
    }
  })
  useWaitForTransaction({
    hash: erc20WriteApprove?.data?.hash,
    confirmations: 1,
    onSuccess() {
      setDialog("ERC20 Approved...")
    }
  })

  const mintPrepare = usePrepareContractWrite({
    address: mintContractAddress as `0x${string}`,
    abi: GenArt721MintV2ABI,
    functionName: "purchase",
    overrides: projectUsesErc20 ? undefined : {
      value: priceWei
    },
    enabled: (!isPaused || artistCanMint) && !isSoldOut && isBalanceVerified && isAllowanceVerified,
    args: [
      BigNumber.from(projectId)
    ]
  })
  let customRequest = mintPrepare.config.request ? {
    data: mintPrepare.config.request?.data,
    from: mintPrepare.config.request?.from,
    gasLimit: multiplyBigNumberByFloat(mintPrepare.config.request?.gasLimit, MULTIPLY_GAS_LIMIT),
    to: mintPrepare.config.request?.to,
    value: mintPrepare.config.request?.value
  } : undefined
  const mintWrite = useContractWrite({
    ...mintPrepare.config,
    request: customRequest,
    onSuccess() {
      setDialog("Transaction pending...")
    }
  })
  useWaitForTransaction({
    hash: mintWrite.data?.hash,
    confirmations: 1,
    onSuccess(data) {
      const mintInterface = new ethers.utils.Interface(GenArt721CoreV2ABI)
      const mintEvent = (data.logs || []).find(
        (receiptEvent: { topics: string[] }) => {
          const event = mintInterface.getEvent(receiptEvent.topics[0]);
          return event && event.name === "Mint";
        }
      )
      const mintEventDecoded = mintInterface.decodeEventLog("Mint", mintEvent?.data!, mintEvent?.topics)
      const tokenId = mintEventDecoded["_tokenId"].toString()
      if (tokenId) {
        setMintingTokenId(tokenId)
        handleMintingPreviewOpen()
      }
      setDialog("")
    }
  })

  const mintingDisabled = isPaused || isSoldOut || !isConnected || !isAllowanceVerified || !isBalanceVerified

  let mintingMessage = `${artistCanMint ? "Artist Mint " : "Purchase "} for ${formatEtherFixed(priceWei.toString(), 3)} ${currencySymbol}`
  if (isPaused && !artistCanMint) mintingMessage = "minting paused"
  else if (isSoldOut) mintingMessage = "sold out"
  else if (!isConnected) mintingMessage = "connect to purchase"
  else if (!isBalanceVerified) mintingMessage = "insufficient funds"
  else if (projectUsesErc20 && !isAllowanceVerified) mintingMessage = "set ERC20 allowance"

  return (
    <>
      <MintingButton
        disabled={mintingDisabled && !artistCanMint}
        message={mintingMessage}
        contractPurchase={projectUsesErc20 && !isAllowanceVerified ? erc20WriteApprove.write : mintWrite.write}
      />
      <Box marginTop={1}>
        <Typography fontStyle="italic">
          {dialog}
        </Typography>
      </Box>
      <Modal
        open={mintingPreview}
        onClose={handleMintingPreviewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "75%",
          bgcolor: "white",
          border: "none",
          boxShadow: 10,
          padding: 5
        }}>
          <Box sx={{display: "grid", justifyContent: "center", alignItems: "center" }}>
            <Typography id="modal-modal-title" variant="h1" fontSize="18px">
              Minted #{mintingTokenId}
            </Typography>
            <Box marginTop={1}>
              <TokenView
                contractAddress={coreContractAddress}
                tokenId={mintingTokenId}
                width={windowSize.width*0.5}
                aspectRatio={scriptAspectRatio}
                live
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default GenArt721MinterButton
