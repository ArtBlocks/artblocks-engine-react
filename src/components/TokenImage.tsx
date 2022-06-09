import { mediaUrl } from "config";

interface Props {
  tokenId: string;
  hd?: boolean;
  thumb?: boolean;
  width?: number | string;
  height?: number | string;
}
const TokenImage = ({ tokenId, hd=false, thumb=false, width='auto', height='auto' }: Props) => {
  return (
    <img src={`${mediaUrl}${hd ? '/hd' : ''}${thumb ? '/thumb' : ''}/${tokenId}.png`} alt={tokenId} width={width} />
  )
}

export default TokenImage;
