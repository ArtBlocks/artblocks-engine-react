import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { generatorUrl, coreContractAddress } from 'config';

interface Props {
  projectId: string;
  tokenId: string;
  aspectRatio?: number;
  invocation?: BigInt;
  width: number;
  height?: number | string;
  showLiveViewLink?: boolean;
  showImageLink?: boolean;
}
const TokenPreview = ({
  projectId,
  tokenId,
  invocation,
  aspectRatio=1,
  width,
}: Props) => {
  const height = width / aspectRatio;

  return (
    <Box>
      <Card>
        <iframe
          title={tokenId}
          src={`${generatorUrl}/${coreContractAddress}/${tokenId}`}
          width={String(width) + 'px'}
          height={String(height)}
          frameBorder="0"
          style={{ marginBottom: '-7px' }}
        />
      </Card>
      <Box sx={{ marginTop: 2 }}>
        { invocation && (
          <Link href={`token/${projectId}/${tokenId}`} sx={{ fontSize: '.8em' }}>
            Showing mint #{invocation.toString()}
          </Link>
        ) }
      </Box>
    </Box>
  )
}

export default TokenPreview;
