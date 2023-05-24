import {useEffect, useState} from "react"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { BigNumber } from "ethers"
import { Box, Typography, Modal } from "@mui/material"
import { MULTIPLY_GAS_LIMIT } from "config"
import { multiplyBigNumberByFloat, formatEtherFixed } from "utils/numbers"
import MinterDAExpSettlementV1ABI from "abi/V3/MinterDAExpSettlementV1.json"
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
  isSoldOut: boolean,
  excessSettlementFunds: BigNumber,
  auctionHasStarted: boolean
}

const MinterDAExpSettlementV1Button = (
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
    isSoldOut,
    excessSettlementFunds,
    auctionHasStarted
  }: Props
) => {
  const windowSize = useWindowSize()
  const [dialog, setDialog] = useState("")
  const [mintingTokenId, setMintingTokenId] = useState<any | null>(null)
  const [mintingPreview, setMintingPreview] = useState(false)
  const handleMintingPreviewOpen = () => setMintingPreview(true)
  const handleMintingPreviewClose = () => setMintingPreview(false)

  useEffect(() => {
    if (excessSettlementFunds.gt(BigNumber.from(0))) {
      setDialog(`${formatEtherFixed(excessSettlementFunds.toString(), 3)} ETH available`)
    }
  }, [excessSettlementFunds])

  const { config } = usePrepareContractWrite({
    address: mintContractAddress as `0x${string}`,
    abi: MinterDAExpSettlementV1ABI,
    functionName: "purchase",
    overrides: {
      value: priceWei
    },
    enabled: !isPaused && !isSoldOut && verifyBalance && auctionHasStarted,
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

  const prepareClaimSettlementFunds = usePrepareContractWrite({
    address: mintContractAddress as `0x${string}`,
    abi: MinterDAExpSettlementV1ABI,
    functionName: "reclaimProjectExcessSettlementFunds",
    enabled: excessSettlementFunds.gt(BigNumber.from(0)),
    args: [
      BigNumber.from(projectId)
    ]
  })
  const writeClaimSettlementFunds = useContractWrite({
    ...prepareClaimSettlementFunds.config,
    onSuccess() {
      setDialog("Claiming settlement funds...")
    }
  })
  useWaitForTransaction({
    hash: writeClaimSettlementFunds?.data?.hash,
    confirmations: 1,
    onSuccess() {
      setDialog("Settlement funds claimed...")
    }
  })

  const isSettlementAvailable = excessSettlementFunds.gt(BigNumber.from(0))

  const mintingDisabled = isPaused || isSoldOut || !isConnected || !verifyBalance || !auctionHasStarted
  let mintingMessage = `Purchase for ${formatEtherFixed(priceWei.toString(), 3)} ${currencySymbol}`
  if (isSettlementAvailable) mintingMessage = "claim settlement funds"
  else if (isPaused) mintingMessage = "minting paused"
  else if (!auctionHasStarted) mintingMessage = "auction not live"
  else if (isSoldOut) mintingMessage = "sold out"
  else if (!isConnected) mintingMessage = "connect to purchase"
  else if (!verifyBalance) mintingMessage = "insufficient funds"

  return (
    <>
      <MintingButton
        disabled={mintingDisabled && !isSettlementAvailable}
        message={mintingMessage}
        contractPurchase={isSettlementAvailable ? writeClaimSettlementFunds.write : write}
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

export default MinterDAExpSettlementV1Button
