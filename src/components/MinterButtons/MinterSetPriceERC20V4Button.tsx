import {useEffect, useState} from "react"
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  useBalance,
  useContractRead
} from "wagmi"
import { BigNumber } from "ethers"
import { Box, Typography, Modal } from "@mui/material"
import { MULTIPLY_GAS_LIMIT } from "config"
import { multiplyBigNumberByFloat, formatEtherFixed } from "utils/numbers"
import MinterSetPriceERC20V4ABI from "abi/V3/MinterSetPriceERC20V4.json"
import TokenView from "components/TokenView"
import useWindowSize from "hooks/useWindowSize"
import MintingButton from "components/MintingButton"
import ERC20ABI from "../../abi/ERC20.json";

interface Props {
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  priceWei: BigNumber
  currencySymbol: string,
  currencyAddress: string,
  isConnected: boolean,
  artistCanMint: boolean,
  anyoneCanMint: boolean,
  scriptAspectRatio: number,
  isPaused: boolean,
  isSoldOut: boolean
}

const MinterSetPriceERC20V4Button = (
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

  const account = useAccount()
  const balance = useBalance({
    address: account.address,
    token: currencyAddress as `0x${string}`
  })
  const [isBalanceVerified, setIsBalanceVerified] = useState(false)
  const [isAllowanceVerified, setIsAllowanceVerified] = useState(false)

  useEffect(() => {
    if (balance?.data?.value.gt(priceWei)) {
      setIsBalanceVerified(true)
    }
  }, [balance, priceWei])

  useContractRead({
    address: currencyAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: "allowance",
    args: [account.address, mintContractAddress],
    watch: true,
    enabled: (!isPaused || artistCanMint) && !isSoldOut,
    onSuccess(data: BigNumber) {
      setIsAllowanceVerified(data >= priceWei)
    }
  })

  const erc20PrepareApprove = usePrepareContractWrite({
    address: currencyAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: "approve",
    enabled: (!isPaused || artistCanMint) && !isSoldOut && !isAllowanceVerified && isBalanceVerified,
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

  const { config } = usePrepareContractWrite({
    address: mintContractAddress as `0x${string}`,
    abi: MinterSetPriceERC20V4ABI,
    functionName: "purchase",
    enabled: (!isPaused || artistCanMint) && !isSoldOut && isBalanceVerified && isAllowanceVerified,
    args: [
      BigNumber.from(projectId)
    ]
  })

  let customRequest = config.request ? {
    data: config.request?.data,
    from: config.request?.from,
    gasLimit: multiplyBigNumberByFloat(config.request?.gasLimit, MULTIPLY_GAS_LIMIT),
    to: config.request?.to,
    value: config.request?.value
  } : undefined

  const { data, write } = useContractWrite({
    ...config,
    request: customRequest,
    onSuccess() {
      setDialog("Transaction pending...")
    }
  })

  useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
    onSuccess(data) {
      let tokenId = data?.logs[0]?.topics[3]
      if (tokenId) {
        setMintingTokenId(parseInt(tokenId, 16).toString())
        handleMintingPreviewOpen()
      }
      setDialog("")
    }
  })

  const mintingDisabled = isPaused || isSoldOut || !isConnected || !isBalanceVerified
  let mintingMessage = `${artistCanMint ? "Artist Mint " : "Purchase "} for ${formatEtherFixed(priceWei.toString(), 3)} ${currencySymbol}`
  if (isPaused && !artistCanMint) mintingMessage = "minting paused"
  else if (isSoldOut) mintingMessage = "sold out"
  else if (!isConnected) mintingMessage = "connect to purchase"
  else if (!isBalanceVerified) mintingMessage = "insufficient funds"
  else if (!isAllowanceVerified) mintingMessage = "set ERC20 allowance"

  return (
    <>
      <MintingButton
        disabled={mintingDisabled && !artistCanMint}
        message={mintingMessage}
        contractPurchase={!isAllowanceVerified ? erc20WriteApprove.write : write}
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

export default MinterSetPriceERC20V4Button
