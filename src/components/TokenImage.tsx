import { CONTRACT_INFO } from "config"

interface Props {
  tokenId: string
  width: number
  height: number
}

const TokenImage = ({tokenId, width, height}: Props) => {
  const mediaUrl = CONTRACT_INFO[tokenId.split('-')[0]].MEDIA_URL
  return (
    <img
      src={`${mediaUrl}/${tokenId.split('-')[1]}.png`}
      alt={tokenId}
      width={width}
      height={height}
    />
  )
}

export default TokenImage
