import { generatorUrl, coreContractAddress } from "config";

interface Props {
  tokenId: string;
  width?: number | string;
  height?: number | string;
}
const TokenPreview = ({ tokenId, width='auto', height='auto' }: Props) => {
  return (
    <iframe
      title={tokenId}
      src={`${generatorUrl}/${coreContractAddress}/${tokenId}`}
      width={width}
      height={height}
      frameBorder="0"
    />
  )
}

export default TokenPreview;
