import { useState } from "react"
import moment from "moment-timezone"
import {useAccount, useBalance, useContractRead, useContractReads} from "wagmi"
import { BigNumber } from "ethers"
import { Box } from "@mui/material"
import GenArt721CoreV3_EngineABI from "abi/V3/GenArt721CoreV3_Engine.json"
import MinterDAExpSettlementV1ABI from "abi/V3/MinterDAExpSettlementV1.json"
import MintingCountdown from "components/MintingCountdown"
import MintingProgress from "components/MintingProgress"
import MintingPrice from "components/MintingPrice"
import MinterDAExpSettlementV1Button from "components/MinterButtons/MinterDAExpSettlementV1Button"
import useCountOwnedTokens from "../../hooks/useCountOwnedTokens";

interface Props {
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  artistAddress: string,
  scriptAspectRatio: number
}

const MinterDAExpSettlementV1Interface = (
  {
    coreContractAddress,
    mintContractAddress,
    projectId,
    artistAddress,
    scriptAspectRatio
  }: Props
) => {

  const account = useAccount()
  const balance = useBalance({
    address: account.address
  })

  const [projectStateData, setProjectStateData] = useState<any | null>(null)
  const [projectPriceInfo, setProjectPriceInfo] = useState<any | null>(null)
  const [projectConfig, setProjectConfig] = useState<any | null>(null)
  const [projectExcessSettlementFunds, setProjectExcessSettlementFunds] = useState<any | null>(BigNumber.from(0))
  const countOwnedTokensResponse = useCountOwnedTokens(`${coreContractAddress}-${projectId}`, account?.address?.toLowerCase() || "")

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: coreContractAddress as `0x${string}`,
        abi: GenArt721CoreV3_EngineABI,
        functionName: "projectStateData",
        args: [BigNumber.from(projectId)]
      },
      {
        address: mintContractAddress as `0x${string}`,
        abi: MinterDAExpSettlementV1ABI,
        functionName: "getPriceInfo",
        args: [BigNumber.from(projectId)]
      },
      {
        address: mintContractAddress as `0x${string}`,
        abi: MinterDAExpSettlementV1ABI,
        functionName: "projectConfig",
        args: [BigNumber.from(projectId)]
      }
    ],
    watch: true,
    onSuccess(data) {
      setProjectStateData(data[0])
      setProjectPriceInfo(data[1])
      setProjectConfig(data[2])
    }
  })

  useContractRead({
    address: mintContractAddress as `0x${string}`,
    abi: MinterDAExpSettlementV1ABI,
    functionName: "getProjectExcessSettlementFunds",
    args: [BigNumber.from(projectId), account.address],
    watch: true,
    enabled: account.isConnected && countOwnedTokensResponse?.data?.tokens?.length > 0,
    onSuccess(data) {
      setProjectExcessSettlementFunds(data)
    }
  })

  if (!data || !projectStateData || !projectPriceInfo || !projectConfig || isLoading || isError) {
    return null
  }

  const invocations = projectStateData.invocations.toNumber()
  const maxInvocations = projectStateData.maxInvocations.toNumber()
  const maxHasBeenInvoked = projectConfig.maxHasBeenInvoked
  const currencySymbol = projectPriceInfo.currencySymbol
  const currentPriceWei = projectPriceInfo.tokenPriceInWei
  const priceIsConfigured = projectPriceInfo.isConfigured
  const startPriceWei = projectConfig.startPrice
  const endPriceWei = projectConfig.basePrice
  const auctionStartUnix = projectConfig.timestampStart.toNumber()
  const auctionHasStarted = auctionStartUnix <= moment().unix()
  const auctionStartFormatted = moment.unix(auctionStartUnix).format("LLL")
  const auctionStartCountdown = moment.unix(auctionStartUnix).fromNow()
  const isSoldOut = maxHasBeenInvoked || invocations >= maxInvocations
  const isPaused = projectStateData.paused
  const isArtist = account.isConnected && account.address?.toLowerCase() === artistAddress?.toLowerCase()
  const isNotArtist = account.isConnected && account.address?.toLowerCase() !== artistAddress?.toLowerCase()
  const artistCanMint = isArtist && priceIsConfigured && !isSoldOut && auctionHasStarted
  const anyoneCanMint = isNotArtist && priceIsConfigured && !isSoldOut && auctionHasStarted && !isPaused

  return (
    <Box>
      <MintingProgress
        invocations={invocations}
        maxInvocations={maxInvocations}
        maxHasBeenInvoked={maxHasBeenInvoked}
      />
      {
        priceIsConfigured && !auctionHasStarted &&
        (
          <MintingCountdown
            auctionStartFormatted={auctionStartFormatted}
            auctionStartCountdown={auctionStartCountdown}
          />
        )
      }
      {
        priceIsConfigured &&
        (
          <MintingPrice
            startPriceWei={startPriceWei}
            currentPriceWei={currentPriceWei}
            endPriceWei={endPriceWei}
            currencySymbol={currencySymbol}
          />
        )
      }
      <MinterDAExpSettlementV1Button
        coreContractAddress={coreContractAddress}
        mintContractAddress={mintContractAddress}
        projectId={projectId}
        priceWei={currentPriceWei}
        currencySymbol={currencySymbol}
        isConnected={account.isConnected}
        artistCanMint={artistCanMint}
        anyoneCanMint={anyoneCanMint}
        scriptAspectRatio={scriptAspectRatio}
        verifyBalance={balance?.data?.value.gt(projectPriceInfo.tokenPriceInWei) || false}
        isPaused={isPaused}
        isSoldOut={isSoldOut}
        excessSettlementFunds={projectExcessSettlementFunds}
        auctionHasStarted={auctionHasStarted}
      />
    </Box>
  )
}

export default MinterDAExpSettlementV1Interface
