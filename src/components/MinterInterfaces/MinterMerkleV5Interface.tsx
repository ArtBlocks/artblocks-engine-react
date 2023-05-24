import { useEffect, useState } from "react"
import { useAccount, useBalance, useContractReads } from "wagmi"
import { BigNumber, utils } from "ethers"
import { Box } from "@mui/material"
import GenArt721CoreV3_EngineABI from "abi/V3/GenArt721CoreV3_Engine.json"
import MinterMerkleV5ABI from "abi/V3/MinterMerkleV5.json"
import MintingProgress from "components/MintingProgress"
import MintingPrice from "components/MintingPrice"
import MinterMerkleV5Button from "components/MinterButtons/MinterMerkleV5Button"
import { MERKLE_PROOF_API_URL } from "config"

interface Props {
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  artistAddress: string,
  scriptAspectRatio: number
}

const MinterMerkleV5Interface = (
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
  const [verifyAddress, setVerifyAddress] = useState<any | null>(false)
  const [remainingInvocations, setRemainingInvocations] = useState<any | null>(null)
  const [merkleProof, setMerkleProof] = useState(null)

  useContractReads({
    contracts: [
      {
        address: mintContractAddress as `0x${string}`,
        abi: MinterMerkleV5ABI,
        functionName: "verifyAddress",
        args: [BigNumber.from(projectId), merkleProof, account.address],
      },
      {
        address: mintContractAddress as `0x${string}`,
        abi: MinterMerkleV5ABI,
        functionName: "projectRemainingInvocationsForAddress",
        args: [BigNumber.from(projectId), account.address],
      }
    ],
    enabled: merkleProof != null && account.isConnected,
    watch: true,
    onSuccess(data) {
      setVerifyAddress(data[0])
      setRemainingInvocations(data[1])
    }
  })

  useEffect(() => {
    if (account.isConnected) {
      fetch(`${MERKLE_PROOF_API_URL}?contractAddress=${coreContractAddress}&projectId=${projectId}&walletAddress=${account.address}`)
        .then(response => response.json())
        .then(data => setMerkleProof(data))
    } else {
      setMerkleProof(null)
      setVerifyAddress(false)
    }
  }, [account.address, account.isConnected]);

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
        abi: MinterMerkleV5ABI,
        functionName: "getPriceInfo",
        args: [BigNumber.from(projectId)]
      },
      {
        address: mintContractAddress as `0x${string}`,
        abi: MinterMerkleV5ABI,
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
      <MinterMerkleV5Button
        coreContractAddress={coreContractAddress}
        mintContractAddress={mintContractAddress}
        projectId={projectId}
        priceWei={currentPriceWei}
        currencySymbol={currencySymbol}
        isConnected={account.isConnected}
        artistCanMint={artistCanMint}
        anyoneCanMint={anyoneCanMint}
        scriptAspectRatio={scriptAspectRatio}
        verifyAddress={verifyAddress}
        remainingInvocations={remainingInvocations?.mintInvocationsRemaining.toNumber()}
        merkleProof={merkleProof}
        verifyBalance={balance?.data?.formatted! >= utils.formatEther(projectPriceInfo.tokenPriceInWei.toString())}
        isPaused={isPaused}
        isSoldOut={isSoldOut}
      />
    </Box>
  )
}

export default MinterMerkleV5Interface
