import { useState } from "react"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { utils, BigNumber } from "ethers"
import {
  Box,
  Link,
  Typography,
  Modal
} from "@mui/material"
import { MULTIPLY_GAS_LIMIT } from "config"
import { multiplyBigNumberByFloat, formatEtherFixed } from "utils/numbers"
import GenArt721MintABI from "abi/MinterDAExpV4.json"
import TokenView from "components/TokenView"
import MintingButtonEnabled from "components/MintingButtonEnabled"
import useWindowSize from "hooks/useWindowSize"

interface Props {
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  priceWei: BigNumber
  currencySymbol: string,
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
  isConnected,
  artistCanMint,
  anyoneCanMint,
  scriptAspectRatio
  }: Props) => {
  const windowSize = useWindowSize()
  const [dialog, setDialog] = useState("")
  const [mintingTokenId, setMintingTokenId] = useState<any | null>(null)
  const [mintingPreview, setMintingPreview] = useState(false)
  const handleMintingPreviewOpen = () => setMintingPreview(true)
  const handleMintingPreviewClose = () => setMintingPreview(false)

  const { config } = usePrepareContractWrite({
    address: mintContractAddress as `0x${string}`,
    abi: GenArt721MintABI,
    functionName: "purchase",
    overrides: {
      value: priceWei
    },
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

  const { data, error, isError, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    request: customRequest,
  })
  
  const waitForTransaction = useWaitForTransaction({
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

  return (
    <>
      {
        artistCanMint &&
        (
          <MintingButtonEnabled
            message={`Artist Mint for ${formatEtherFixed(priceWei.toString(), 3)} ${currencySymbol}`}
            contractPurchase={write}
          />
        )
      }
      {
        anyoneCanMint &&
        (
          <MintingButtonEnabled
            message={`Purchase for ${formatEtherFixed(priceWei.toString(), 3)} ${currencySymbol}`}
            contractPurchase={write}
          />
        )
      }
      {
        anyoneCanMint && !isConnected &&
        (
          <Typography fontWeight={800} fontStyle="italic">
            Connect to purchase...
          </Typography>
        )
      }
      <Box marginTop={1}>
          {isLoading && <Typography fontStyle="italic">Check Wallet</Typography>}
          {isSuccess && <Typography fontStyle="italic">Transaction: <span><Link target="_blank" href={`https://etherscan.io/tx/${data?.hash}`}>{"View transaction on Etherscan"}</Link></span></Typography>}
          {isError && <Typography fontStyle="italic">Error while minting: {error?.message}</Typography>}
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
