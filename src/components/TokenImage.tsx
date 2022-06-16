import Card from '@mui/material/Card';
import { mediaUrl } from 'config';

interface Props {
  tokenId: string;
  width: number;
  hd?: boolean;
  thumb?: boolean;
  aspectRatio?: number;
}

const TokenImage = ({
  tokenId,
  hd=false,
  thumb=false,
  width,
  aspectRatio=1,
}: Props) => {
  const height = width / aspectRatio;

  return (
    <Card>
      <img
        src={`${mediaUrl}${hd ? '/hd' : ''}${thumb ? '/thumb' : ''}/${tokenId}.png`}
        alt={tokenId}
        width={width}
        height={height}
        style={{ marginBottom: '-7px' }}
      />
    </Card>
  )
}

export default TokenImage;
