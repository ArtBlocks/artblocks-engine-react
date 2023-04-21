import { useState } from "react"
import { useContractRead } from "wagmi"
import { BigNumber } from "ethers"
import MinterFilterV1ABI from "abi/V3/MinterFilterV1.json"
import { getV3MinterType } from "utils/mintingInterface";

interface Props {
  coreContractAddress: string,
  mintContractAddress: string,
  projectId: string,
  artistAddress: string,
  scriptAspectRatio: number
}

const MintingInterfaceV3 = ({ coreContractAddress, mintContractAddress, projectId, artistAddress, scriptAspectRatio }: Props) => {
  const [projectAndMinterInfo, setProjectAndMinterInfo] = useState<any | null>(null)
  const { data, isError, isLoading } = useContractRead({
    address: mintContractAddress as `0x${string}`,
    abi: MinterFilterV1ABI,
    functionName: "getProjectAndMinterInfoAt",
    args: [BigNumber.from(projectId)],
    watch: true,
    onSuccess(data) {
      setProjectAndMinterInfo(data)
    }
  })

  if (!data || !projectAndMinterInfo || isLoading || isError) {
    return null
  }

  const V3MintingInterface = getV3MinterType(projectAndMinterInfo.minterType)
  return V3MintingInterface && (
    <V3MintingInterface
      coreContractAddress={coreContractAddress}
      mintContractAddress={projectAndMinterInfo.minterAddress}
      projectId={projectId}
      artistAddress={artistAddress}
      scriptAspectRatio={scriptAspectRatio}
    />
  )
}

export default MintingInterfaceV3
