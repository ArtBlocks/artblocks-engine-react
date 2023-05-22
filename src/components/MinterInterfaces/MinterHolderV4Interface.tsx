import {useEffect, useState} from "react"
import { useAccount, useBalance, useContractReads } from "wagmi"
import { BigNumber, utils } from "ethers"
import { Box } from "@mui/material"
import GenArt721CoreV3_EngineABI from "abi/V3/GenArt721CoreV3_Engine.json"
import MinterHolderV4ABI from "abi/V3/MinterHolderV4.json"
import MintingProgress from "components/MintingProgress"
import MintingPrice from "components/MintingPrice"
import MinterHolderV4Button from "components/MinterButtons/MinterHolderV4Button"
import {EXPECTED_CHAIN_ID, HOLDER_PROOF_API_URL} from "config"

interface Props {
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  artistAddress: string,
  scriptAspectRatio: number
}

const MinterHolderV4Interface = (
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
  const [holderProof, setHolderProof] = useState<any | null>(null)

  useEffect(() => {
    if (account.isConnected) {
      fetch(`${HOLDER_PROOF_API_URL}?contractAddress=${coreContractAddress}&projectId=${projectId}&walletAddress=${account.address}&isMainnet=${EXPECTED_CHAIN_ID === 0 ? 1 : 0}`)
        .then(response => response.json())
        .then(data => setHolderProof(data))
    }
  }, [account.isConnected, account.address, coreContractAddress, projectId])

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
        abi: MinterHolderV4ABI,
        functionName: "getPriceInfo",
        args: [BigNumber.from(projectId)]
      },
      {
        address: mintContractAddress as `0x${string}`,
        abi: MinterHolderV4ABI,
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
      <MinterHolderV4Button
        coreContractAddress={coreContractAddress}
        mintContractAddress={mintContractAddress}
        projectId={projectId}
        priceWei={currentPriceWei}
        currencySymbol={currencySymbol}
        isConnected={account.isConnected}
        artistCanMint={artistCanMint}
        anyoneCanMint={anyoneCanMint}
        scriptAspectRatio={scriptAspectRatio}
        verifyBalance={balance?.data?.formatted! >= utils.formatEther(projectPriceInfo.tokenPriceInWei.toString())}
        isPaused={isPaused}
        isSoldOut={isSoldOut}
        holderContractAddress={holderProof?.contractAddress}
        holderTokenId={holderProof?.tokenId}
      />
    </Box>
  )
}

export default MinterHolderV4Interface
