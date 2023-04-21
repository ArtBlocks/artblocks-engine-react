import { useState } from "react"
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useBalance,
  useAccount,
  useContractRead
} from "wagmi"
import { BigNumber } from "ethers"
import {
  Box,
  Typography,
  Modal
} from "@mui/material"
import { MULTIPLY_GAS_LIMIT } from "config"
import { multiplyBigNumberByFloat, formatEtherFixed } from "utils/numbers"
import GenArt721MintABI from "abi/V2/GenArt721MintV2.json"
import TokenView from "components/TokenView"
import MintingButtonEnabled from "components/MintingButtonEnabled"
import useWindowSize from "hooks/useWindowSize"
import ERC20ABI from "abi/ERC20.json";
import MintingButtonDisabled from "components/MintingButtonDisabled";

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
  scriptAspectRatio: number
}

const MintingInteraction = ({
  coreContractAddress,
  mintContractAddress,
  projectId,
  priceWei,
  currencySymbol,
  currencyAddress,
  isConnected,
  artistCanMint,
  anyoneCanMint,
  scriptAspectRatio
  }: Props) => {
  const projectUsesErc20 = currencyAddress !== "0x0000000000000000000000000000000000000000"
  const windowSize = useWindowSize()
  const account = useAccount()
  const ethBalance = useBalance({
    address: account.address
  })
  const erc20Balance = useBalance({
    address: account.address,
    token: projectUsesErc20 ? currencyAddress as `0x${string}` : undefined
  })
  const [erc20Allowance, setErc20Allowance] = useState<any | null>(null)
  const [dialog, setDialog] = useState("")
  const [mintingTokenId, setMintingTokenId] = useState<any | null>(null)
  const [mintingPreview, setMintingPreview] = useState(false)
  const handleMintingPreviewOpen = () => setMintingPreview(true)
  const handleMintingPreviewClose = () => setMintingPreview(false)

  const mintPrepare = usePrepareContractWrite({
    address: mintContractAddress as `0x${string}`,
    abi: GenArt721MintABI,
    functionName: "purchase",
    overrides: projectUsesErc20 ? undefined : {
      value: priceWei
    },
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
    onSuccess(data) {
      setDialog("Transaction pending...")
    }
  })
  const mintWaitForTransaction = useWaitForTransaction({
    hash: mintWrite.data?.hash,
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

  const erc20ReadAllowance = useContractRead({
    address: currencyAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: "allowance",
    args: [account.address, mintContractAddress],
    watch: true,
    enabled: projectUsesErc20,
    onSuccess(data) {
      setErc20Allowance(data)
    }
  })
  const erc20PrepareApprove = usePrepareContractWrite({
    address: currencyAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: "approve",
    enabled: projectUsesErc20,
    args: [
      mintContractAddress, BigNumber.from(priceWei)
    ]
  })
  const erc20WriteApprove = useContractWrite({
    ...erc20PrepareApprove.config,
    onSuccess(data) {
      setDialog("Approving ERC20...")
    }
  })
  const erc20WaitForTransactionApprove = useWaitForTransaction({
    hash: erc20WriteApprove?.data?.hash,
    confirmations: 1,
    onSuccess(data) {
      setDialog("ERC20 Approved...")
    }
  })

  let MintingButton;
  const mintMessage = `${artistCanMint ? "Artist Mint " : "Purchase " } for ${formatEtherFixed(priceWei.toString(), 3)} ${currencySymbol}`
  if (isConnected) {
    if (projectUsesErc20) {
      if (erc20Balance?.data?.value! >= priceWei) {
        if (erc20Allowance >= priceWei) {
          MintingButton = <MintingButtonEnabled message={mintMessage} contractPurchase={mintWrite.write} />
        } else {
          MintingButton = <MintingButtonEnabled message={"Approve ERC20"} contractPurchase={erc20WriteApprove?.write} />
        }
      } else {
        MintingButton = <MintingButtonDisabled message={ "Insufficient funds..." } />
      }
    } else {
      if (ethBalance?.data?.value! >= priceWei) {
        MintingButton = <MintingButtonEnabled message={mintMessage} contractPurchase={mintWrite.write} />
      } else {
        MintingButton = <MintingButtonDisabled message={ "Insufficient funds..." } />
      }
    }
  } else {
    MintingButton = <MintingButtonDisabled message={ "Connect to purchase..." } />
  }

  return (
    <>
      {MintingButton}
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

export default MintingInteraction
