import { MEDIA_URL } from "config"

interface Props {
  tokenId: string
  width: number
  height: number
}

const TokenImage = ({tokenId, width, height}: Props) => {
  return (
    <img
      src={`${MEDIA_URL}/${tokenId}.png`}
      alt={tokenId}
      width={width}
      height={height}
    />
  )
}

export default TokenImage
