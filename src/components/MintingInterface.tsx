import { useState } from "react"
import moment from "moment-timezone"
import { useAccount, useContractReads } from "wagmi"
import { BigNumber } from "ethers"
import { Box } from "@mui/material"
import { CORE_CONTRACT_ADDRESS, MINT_CONTRACT_ADDRESS } from "config"
import GenArt721CoreABI from "abi/GenArt721Core.json"
import GenArt721MintABI from "abi/GenArt721Mint.json"
import MintingCountdown from "components/MintingCountdown"
import MintingProgress from "components/MintingProgress"
import MintingPrice from "components/MintingPrice"
import MintingButton from "components/MintingButton"

interface Props {
  projectId: string,
  artistAddress: string,
  scriptAspectRatio: number
}

const MintingInterface = ({ projectId, artistAddress, scriptAspectRatio }: Props) => {
  const [projectData, setProjectData] = useState<any | null>(null)
  const [projectPrice, setProjectPrice] = useState<any | null>(null)
  const [projectAuction, setProjectAuction] = useState<any | null>(null)
  const { address, isConnected } = useAccount()
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: CORE_CONTRACT_ADDRESS,
        abi: GenArt721CoreABI,
        functionName: "projectStateData",
        args: [BigNumber.from(projectId)]
      },
      {
        address: MINT_CONTRACT_ADDRESS,
        abi: GenArt721MintABI,
        functionName: "getPriceInfo",
        args: [BigNumber.from(projectId)]
      },
      {
        address: MINT_CONTRACT_ADDRESS,
        abi: GenArt721MintABI,
        functionName: "projectConfig",
        args: [BigNumber.from(projectId)]
      }
    ],
    watch: true,
    onSuccess(data) {
      setProjectData(data[0])
      setProjectPrice(data[1])
      setProjectAuction(data[2])
    }
  })

  if (!data || !projectData || !projectPrice || !projectAuction || isLoading || isError) {
    return null
  }

  let invocations = projectData.invocations.toNumber()
  let maxInvocations = projectData.maxInvocations.toNumber()
  let maxHasBeenInvoked = projectAuction.maxHasBeenInvoked
  let currencySymbol = projectPrice.currencySymbol
  //let currencyAddress = projectPrice.currencyAddress
  let currentPriceWei = projectPrice.tokenPriceInWei
  let priceIsConfigured = projectPrice.isConfigured
  let startPriceWei = projectAuction.startPrice
  let endPriceWei = projectAuction.basePrice
  let auctionStartUnix = projectAuction.timestampStart.toNumber()
  let auctionHasStarted = auctionStartUnix <= moment().unix()
  let auctionStartFormatted = moment.unix(auctionStartUnix).format("LLL")
  let auctionStartCountdown = moment.unix(auctionStartUnix).fromNow()
  //let priceDecayHalfLifeSeconds = projectAuction.priceDecayHalfLifeSeconds
  let isSoldOut = maxHasBeenInvoked || invocations >= maxInvocations
  let isPaused = projectData.paused
  let isArtist = isConnected && address?.toLowerCase() === artistAddress?.toLowerCase()
  let isNotArtist = isConnected && address?.toLowerCase() !== artistAddress?.toLowerCase()
  let artistCanMint = isArtist && priceIsConfigured && !isSoldOut && auctionHasStarted
  let anyoneCanMint = isNotArtist && priceIsConfigured && !isSoldOut && auctionHasStarted && !isPaused

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
      <MintingButton
        projectId={projectId}
        priceWei={currentPriceWei}
        currencySymbol={currencySymbol}
        isConnected={isConnected}
        artistCanMint={artistCanMint}
        anyoneCanMint={anyoneCanMint}  
        scriptAspectRatio={scriptAspectRatio}  
      />
    </Box>
  )
}

export default MintingInterface