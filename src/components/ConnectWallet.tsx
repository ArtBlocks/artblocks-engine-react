import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import {
  metaMask,
  metaMaskHooks,
  walletConnect,
  walletConnectHooks,
  coinbaseWallet,
  coinbaseWalletHooks,
} from 'utils/connectors';
import WalletConnector from './WalletConnector';

const ConnectWallet = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Connect Wallet
      </Button>

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
        <Box sx={{
          padding: 2,
        }}>
          <Typography pb={1} variant="h6">
            Choose a wallet
          </Typography>
          
          <Divider />
          
          <Box sx={{
            display: 'flex',
            marginTop: 3,
            margin: '8px auto',
            width: '100%',
            maxWidth: '400px',
            alignItems: 'center',
            flexDirection: ['column', 'row'],
          }}>
            <WalletConnector
              name="MetaMask"
              logo="/img/metamask-logo.svg"
              connector={metaMask}
              hooks={metaMaskHooks}
              onError={setError}
              onSuccess={handleClose}
            />
            <WalletConnector
              name="Wallet Connect"
              logo="/img/wallet-connect-logo.svg"
              connector={walletConnect}
              hooks={walletConnectHooks}
              onError={setError}
              onSuccess={handleClose}
            />
            <WalletConnector
              name="Coinbase Wallet"
              logo="/img/coinbase-wallet-logo.png"
              connector={coinbaseWallet}
              hooks={coinbaseWalletHooks}
              onError={setError}
              onSuccess={handleClose}
            />
          </Box>

          {
            error && (
              <Alert severity="error">
                { error }
              </Alert>
            )
          }

        </Box>
      </Dialog>
    </>
  );
}

export default ConnectWallet;
