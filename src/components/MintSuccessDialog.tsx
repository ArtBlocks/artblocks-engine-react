import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TokenPreview from './TokenPreview';
import { useWindowSize } from 'hooks/useWindowSize';
import { coreContractAddress } from 'config';

interface Props {
  open: boolean;
  handleClose: () => void;
  mintedTokenId: string | null;
  aspectRatio?: number;
}

const MintSuccessDialog = ({
  open,
  handleClose,
  mintedTokenId,
  aspectRatio=1,
}: Props) => {
  const size = useWindowSize();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          m: 0,
          position: 'fixed',
          top: 140,
        }
      }}
      fullWidth
    >
      <Alert severity="success">
        Mint successful!
      </Alert>
      
      {
        mintedTokenId && (
          <Box sx={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
            <TokenPreview
              id={`${coreContractAddress?.toLowerCase()}-${mintedTokenId}`}
              tokenId={mintedTokenId}
              aspectRatio={aspectRatio}
              width={Math.min(size.width - 32, 400)}
            />
          </Box>
        )
      }

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button color="secondary" sx={{ marginRight: 1 }} onClick={handleClose}>
          Close
        </Button>
        <Button href={`/token/${coreContractAddress?.toLowerCase()}-${mintedTokenId}`} color="primary">
          View details
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MintSuccessDialog;
