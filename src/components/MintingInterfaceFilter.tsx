import { useState } from "react"
import { useContractRead } from "wagmi"
import { BigNumber } from "ethers"
import MinterFilterV1ABI from "abi/V3/MinterFilterV1.json"
import { getMintingInterface } from "utils/getMintingInterface"

interface Props {
  contractVersion: string,
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  artistAddress: string,
  scriptAspectRatio: number
}

const MintingInterfaceFilter = (
  {
    contractVersion,
    coreContractAddress,
    mintContractAddress,
    projectId,
    artistAddress,
    scriptAspectRatio
  }: Props
) => {

    const [v3ProjectAndMinterInfo, setV3ProjectAndMinterInfo] = useState<any | null>(null)
    const { data, isError, isLoading } = useContractRead({
      address: mintContractAddress as `0x${string}`,
      abi: MinterFilterV1ABI,
      functionName: "getProjectAndMinterInfoAt",
      args: [BigNumber.from(projectId)],
      enabled: contractVersion === "V3",
      watch: true,
      onSuccess(data) {
        setV3ProjectAndMinterInfo(data)
      }
    })

    if (contractVersion === "V3" && (!data || !v3ProjectAndMinterInfo || isLoading || isError)) {
      return null
    }

    let minterType = null
    let minterAddress = mintContractAddress
    if (contractVersion === "V3") {
      if (!data || !v3ProjectAndMinterInfo || isLoading || isError) return null
      minterType = v3ProjectAndMinterInfo?.minterType
      minterAddress = v3ProjectAndMinterInfo.minterAddress
    }

    const MintingInterface = getMintingInterface(contractVersion, minterType)
    return MintingInterface && (
      <MintingInterface
        coreContractAddress={coreContractAddress}
        mintContractAddress={minterAddress}
        projectId={projectId}
        artistAddress={artistAddress}
        scriptAspectRatio={scriptAspectRatio}
      />
    )
}

export default MintingInterfaceFilter
