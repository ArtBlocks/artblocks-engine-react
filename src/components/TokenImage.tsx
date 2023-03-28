import { CONTRACT_INFO } from "config"

interface Props {
  contractAddress: string
  tokenId: string
  width: number
  height: number
}

const TokenImage = ({contractAddress, tokenId, width, height}: Props) => {
  const contractConfig = CONTRACT_INFO.filter(
      x => x.CORE_CONTRACT_ADDRESS.toLowerCase() == contractAddress.toLowerCase()
  )

  return (
    <img
      src={`${contractConfig[0].MEDIA_URL}/${tokenId}.png`}
      alt={tokenId}
      width={width}
      height={height}
    />
  )
}

export default TokenImage
