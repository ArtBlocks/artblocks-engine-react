import { MEDIA_URL, CORE_CONTRACT_ADDRESS } from "config"

interface Props {
  tokenId: string
  width: number
  height: number
}

const TokenImage = ({tokenId, width, height}: Props) => {
  return (
    <img
      src={`${MEDIA_URL}/${CORE_CONTRACT_ADDRESS}/${tokenId}.png`}
      alt={tokenId}
      width={width}
      height={height}
    />
  )
}

export default TokenImage
