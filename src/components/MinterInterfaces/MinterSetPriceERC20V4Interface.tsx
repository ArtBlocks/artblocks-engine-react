import { useState } from "react"
import { useAccount, useContractReads } from "wagmi"
import { BigNumber } from "ethers"
import { Box } from "@mui/material"
import GenArt721CoreV3_EngineABI from "abi/V3/GenArt721CoreV3_Engine.json"
import MinterSetPriceERC20V4ABI from "abi/V3/MinterSetPriceERC20V4.json"
import MintingProgress from "components/MintingProgress"
import MintingPrice from "components/MintingPrice"
import MinterSetPriceERC20V4Button from "components/MinterButtons/MinterSetPriceERC20V4Button"

interface Props {
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  artistAddress: string,
  scriptAspectRatio: number
}

const MinterSetPriceERC20V4Interface = (
  {
    coreContractAddress,
    mintContractAddress,
    projectId,
    artistAddress,
    scriptAspectRatio
  }: Props
) => {

  const account = useAccount()

  const [projectStateData, setProjectStateData] = useState<any | null>(null)
  const [projectPriceInfo, setProjectPriceInfo] = useState<any | null>(null)
  const [projectConfig, setProjectConfig] = useState<any | null>(null)

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
        abi: MinterSetPriceERC20V4ABI,
        functionName: "getPriceInfo",
        args: [BigNumber.from(projectId)]
      },
      {
        address: mintContractAddress as `0x${string}`,
        abi: MinterSetPriceERC20V4ABI,
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

  if (!data || !projectStateData || !projectPriceInfo || !projectConfig || isLoading || isError) {
    return null
  }

  const invocations = projectStateData.invocations.toNumber()
  const maxInvocations = projectStateData.maxInvocations.toNumber()
  const maxHasBeenInvoked = projectConfig.maxHasBeenInvoked
  const currencySymbol = projectPriceInfo.currencySymbol
  const currencyAddress = projectPriceInfo.currencyAddress
  const currentPriceWei = projectPriceInfo.tokenPriceInWei
  const priceIsConfigured = projectPriceInfo.isConfigured
  const isSoldOut = maxHasBeenInvoked || invocations >= maxInvocations
  const isPaused = projectStateData.paused
  const isArtist = account.isConnected && account.address?.toLowerCase() === artistAddress?.toLowerCase()
  const isNotArtist = account.isConnected && account.address?.toLowerCase() !== artistAddress?.toLowerCase()
  const artistCanMint = isArtist && priceIsConfigured && !isSoldOut
  const anyoneCanMint = isNotArtist && priceIsConfigured && !isSoldOut && !isPaused

  return (
    <Box>
      <MintingProgress
        invocations={invocations}
        maxInvocations={maxInvocations}
        maxHasBeenInvoked={maxHasBeenInvoked}
      />
      {
        priceIsConfigured &&
        (
          <MintingPrice
            startPriceWei={currentPriceWei}
            currentPriceWei={currentPriceWei}
            endPriceWei={currentPriceWei}
            currencySymbol={currencySymbol}
          />
        )
      }
      <MinterSetPriceERC20V4Button
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
        isSoldOut={isSoldOut}
      />
    </Box>
  )
}

export default MinterSetPriceERC20V4Interface
