import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';
import { generatorUrl, coreContractAddress, mediaUrl } from 'config';
import Address from './Address';

interface Props {
  id: string;
  tokenId: string;
  aspectRatio?: number;
  invocation?: BigInt;
  width: number;
  height?: number | string;
  showLiveViewLink?: boolean;
  showImageLink?: boolean;
  owner?: string;
}
const TokenPreview = ({
  id,
  tokenId,
  invocation,
  width,
  aspectRatio=1,
  showLiveViewLink,
  showImageLink,
  owner,
}: Props) => {
  const height = width / aspectRatio;

  return (
    <Box>
      <Card>
        <iframe
          title={tokenId}
          src={`${generatorUrl}/${coreContractAddress?.toLowerCase()}/${tokenId}`}
          width={String(width) + 'px'}
          height={String(height)}
          frameBorder="0"
          style={{ marginBottom: '-7px' }}
        />
      </Card>
      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          { invocation && (
            <Link href={`token/${id}`} sx={{ fontSize: '.8em' }}>
              Showing mint #{invocation.toString()}
            </Link>
          ) }
          {
            owner && (
              <Typography>
                Owned by <Address address={owner} />
              </Typography>
            )
          }
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {
            showLiveViewLink && (
              <Button
                startIcon={<VisibilityIcon sx={{ color: '#666'}} />}
                sx={{ fontSize: 14, textTransform: 'none' }}
                onClick={() => {
                  window.open(`${generatorUrl}/${tokenId}`);
                }}
              >
                Live view
              </Button>
            )
          }
          {
            showImageLink && ( 
              <Button
                startIcon={<ImageIcon  sx={{ color: '#666'}} />}
                sx={{ fontSize: 14, textTransform: 'none', marginLeft: 2 }}
                onClick={() => {
                  window.open(`${mediaUrl}/${tokenId}.png`);
                }}
              >
                Image
              </Button>
            )
          }
        </Box>
      </Box>
    </Box>
  )
}

export default TokenPreview;
