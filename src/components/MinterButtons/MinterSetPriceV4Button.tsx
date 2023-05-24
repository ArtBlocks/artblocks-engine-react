import { useState } from "react"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { BigNumber } from "ethers"
import { Box, Typography, Modal } from "@mui/material"
import { MULTIPLY_GAS_LIMIT } from "config"
import { multiplyBigNumberByFloat, formatEtherFixed } from "utils/numbers"
import MinterMerkleV5ABI from "abi/V3/MinterMerkleV5.json"
import TokenView from "components/TokenView"
import useWindowSize from "hooks/useWindowSize"
import MintingButton from "components/MintingButton"

interface Props {
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  priceWei: BigNumber
  currencySymbol: string,
  isConnected: boolean,
  artistCanMint: boolean,
  anyoneCanMint: boolean,
  scriptAspectRatio: number,
  verifyBalance: boolean,
  isPaused: boolean,
  isSoldOut: boolean
}

const MinterSetPriceV4Button = (
  {
    coreContractAddress,
    mintContractAddress,
    projectId,
    priceWei,
    currencySymbol,
    isConnected,
    artistCanMint,
    anyoneCanMint,
    scriptAspectRatio,
    verifyBalance,
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

  const { config } = usePrepareContractWrite({
    address: mintContractAddress as `0x${string}`,
    abi: MinterMerkleV5ABI,
    functionName: "purchase",
    overrides: {
      value: priceWei
    },
    enabled: (!isPaused || artistCanMint) && !isSoldOut && verifyBalance,
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

  const mintingDisabled = isPaused || isSoldOut || !isConnected || !verifyBalance
  let mintingMessage = `${artistCanMint ? "Artist Mint " : "Purchase "} for ${formatEtherFixed(priceWei.toString(), 3)} ${currencySymbol}`
  if (isPaused && !artistCanMint) mintingMessage = "minting paused"
  else if (isSoldOut) mintingMessage = "sold out"
  else if (!isConnected) mintingMessage = "connect to purchase"
  else if (!verifyBalance) mintingMessage = "insufficient funds"

  return (
    <>
      <MintingButton
        disabled={mintingDisabled && !artistCanMint}
        message={mintingMessage}
        contractPurchase={write}
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

export default MinterSetPriceV4Button
