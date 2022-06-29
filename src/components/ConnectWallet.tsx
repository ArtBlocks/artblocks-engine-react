import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  metaMask,
  metaMaskHooks,
  walletConnect,
  walletConnectHooks,
  coinbaseWallet,
  coinbaseWalletHooks,
} from 'utils/connectors';
import WalletConnector from './WalletConnector';
import Address from './Address';

const ConnectWallet = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const { isActive, account, connector } = useWeb3React();

  useEffect(() => {
    try {
      if (connector?.connectEagerly) {
        connector.connectEagerly();
      }
    } catch(error) {
      console.log(error);
    }
  }, []); // eslint-disable-line

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(undefined);
  }

  const disconnect = () => {
    if (connector?.deactivate) {
      try {
        connector.deactivate();
      } catch (error) {
        console.log(error);
      }
    } else {
      void connector.resetState()
    }
  }

  return (
    <>
      {
        isActive && account ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Address address={account} />
            <IconButton onClick={disconnect} sx={{ marginLeft: 1, color: 'white' }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        ) : (
          <Button variant="contained" onClick={handleOpen}>
            Connect Wallet
          </Button>
        )
      }

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
            maxWidth: '550px',
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
