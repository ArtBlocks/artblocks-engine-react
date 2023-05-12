import { useState } from "react"
import moment from "moment-timezone"
import { useAccount, useContractReads } from "wagmi"
import { BigNumber } from "ethers"
import { Box } from "@mui/material"
import { CORE_CONTRACT_ADDRESS, MINT_CONTRACT_ADDRESS } from "config"
import GenArt721CoreABI from "abi/GenArt721CoreV3.json"
import GenArt721MintABI from "abi/MinterDAExpV4.json"
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

  const invocations = projectData.invocations.toNumber()
  const maxInvocations = projectData.maxInvocations.toNumber()
  const currencySymbol = projectPrice.currencySymbol
  //const currencyAddress = projectPrice.currencyAddress
  const currentPriceWei = projectPrice.tokenPriceInWei
  const priceIsConfigured = projectPrice.isConfigured
  const maxHasBeenInvoked = projectAuction.maxHasBeenInvoked
  const startPriceWei = projectAuction.startPrice
  const endPriceWei = projectAuction.basePrice
  const auctionStartUnix = projectAuction.timestampStart.toNumber()
  const auctionHasStarted = auctionStartUnix <= moment().unix()
  const auctionStartFormatted = moment.unix(auctionStartUnix).format("LLL")
  const auctionStartCountdown = moment.unix(auctionStartUnix).fromNow()
  const minterMaxInvocations = projectAuction.maxInvocations.toNumber()
  //const priceDecayHalfLifeSeconds = projectAuction.priceDecayHalfLifeSeconds
  const isSoldOut = maxHasBeenInvoked || invocations >= minterMaxInvocations
  const isPaused = projectData.paused
  const isArtist = isConnected && address?.toLowerCase() === artistAddress?.toLowerCase()
  const isNotArtist = isConnected && address?.toLowerCase() !== artistAddress?.toLowerCase()
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