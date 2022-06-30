import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { coreContractAddress, mediaUrl } from 'config';

interface Props {
  tokenId: string;
  width: number;
  hd?: boolean;
  thumb?: boolean;
  aspectRatio?: number;
  invocation?: BigInt;
}

const TokenImage = ({
  tokenId,
  hd=false,
  thumb=false,
  width,
  aspectRatio=1,
  invocation,
}: Props) => {
  const height = width / aspectRatio;

  return (
    <Box>
      <Card>
        <img
          src={`${mediaUrl}${hd ? '/hd' : ''}${thumb ? '/thumb' : ''}/${tokenId}.png`}
          alt={tokenId}
          width={width}
          height={height}
          style={{ marginBottom: '-7px' }}
        />
      </Card>
      { invocation !== undefined && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Link href={`/token/${coreContractAddress}-${tokenId}`} sx={{ fontSize: '14px', marginTop: 1 }}>
            Mint #{ invocation?.toString() }
          </Link>
        </Box>
      ) }
    </Box>
  )
}

export default TokenImage;
