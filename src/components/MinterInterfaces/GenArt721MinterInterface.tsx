import { useState } from "react"
import { useAccount, useContractReads } from "wagmi"
import { BigNumber } from "ethers"
import { Box } from "@mui/material"
import MintingProgress from "components/MintingProgress"
import MintingPrice from "components/MintingPrice"
import GenArt721CoreV2ABI from "abi/V2/GenArt721CoreV2.json"
import GenArt721MinterButton from "components/MinterButtons/GenArt721MinterButton"

interface Props {
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  artistAddress: string,
  scriptAspectRatio: number
}

const GenArt721MinterInterface = (
  {
    coreContractAddress,
    mintContractAddress,
    projectId,
    artistAddress,
    scriptAspectRatio
  }: Props
) => {

  const account = useAccount()

  const [projectDetails, setProjectDetails] = useState<any | null>(null)
  const [projectTokenInfo, setProjectTokenInfo] = useState<any | null>(null)
  const [projectScriptInfo, setProjectScriptInfo] = useState<any | null>(null)

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: coreContractAddress as `0x${string}`,
        abi: GenArt721CoreV2ABI,
        functionName: "projectDetails",
        args: [BigNumber.from(projectId)]
      },
      {
        address: coreContractAddress as `0x${string}`,
        abi: GenArt721CoreV2ABI,
        functionName: "projectTokenInfo",
        args: [BigNumber.from(projectId)]
      },
      {
        address: coreContractAddress as `0x${string}`,
        abi: GenArt721CoreV2ABI,
        functionName: "projectScriptInfo",
        args: [BigNumber.from(projectId)]
      }
    ],
    watch: true,
    onSuccess(data) {
      setProjectDetails(data[0])
      setProjectTokenInfo(data[1])
      setProjectScriptInfo(data[2])
    }
  })

  if (!data || !projectDetails || !projectTokenInfo || !projectScriptInfo || isLoading || isError) {
    return null
  }

  const invocations = projectTokenInfo.invocations.toNumber()
  const maxInvocations = projectTokenInfo.maxInvocations.toNumber()
  const maxHasBeenInvoked = invocations >= maxInvocations
  const currencySymbol = projectTokenInfo.currency
  const currencyAddress = projectTokenInfo.currencyAddress
  const currentPriceWei = projectTokenInfo.pricePerTokenInWei
  const isPaused = projectScriptInfo.paused
  const isArtist = account.isConnected && account.address?.toLowerCase() === artistAddress?.toLowerCase()
  const isNotArtist = account.isConnected && account.address?.toLowerCase() !== artistAddress?.toLowerCase()
  const artistCanMint = isArtist && !maxHasBeenInvoked
  const anyoneCanMint = isNotArtist && !maxHasBeenInvoked && !isPaused

  return (
    <Box>
      <MintingProgress
        invocations={invocations}
        maxInvocations={maxInvocations}
        maxHasBeenInvoked={maxHasBeenInvoked}
      />
      <MintingPrice
        startPriceWei={currentPriceWei}
        currentPriceWei={currentPriceWei}
        endPriceWei={currentPriceWei}
        currencySymbol={currencySymbol}
      />
      <GenArt721MinterButton
        coreContractAddress={coreContractAddress}
        mintContractAddress={mintContractAddress}
        projectId={projectId}
        priceWei={currentPriceWei}
        currencySymbol={currencySymbol}
        currencyAddress={currencyAddress}
        isConnected={account.isConnected}
        artistCanMint={artistCanMint}
        anyoneCanMint={anyoneCanMint}
        scriptAspectRatio={scriptAspectRatio}
        isPaused={isPaused}
        isSoldOut={maxHasBeenInvoked}
      />
    </Box>
  )
}

export default GenArt721MinterInterface
