import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/material';
import { metaMask } from 'utils/connectors';

interface WalletIconProps {
  name: string;
  logo: string;
  onClick?: () => void;
  width?: number | string;
}

const WalletIcon = ({ name, logo, width=100, onClick, ...styles }: WalletIconProps & SxProps) => (
  <ButtonBase onClick={onClick}>
    <Box
      sx={{
        height: 160,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        cursor: 'pointer',
        marginRight: [0, 3],
        ...styles,
      }}
    >
      <img src={logo} alt={name} width={width} />
      <Typography pb={2} fontSize={14} fontWeight={400} textAlign="center">
        { name }
      </Typography>
    </Box>
  </ButtonBase>
);

const ConnectWallet = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const connectWithMetamask = () => {
    metaMask.activate(1);
  };

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
            marginLeft: 'auto',
            width: '100%',
            maxWidth: 460,
            alignItems: 'center',
            flexDirection: ['column', 'row'],
          }}>
            <WalletIcon
              name="MetaMask"
              logo="/img/metamask-logo.svg"
              onClick={connectWithMetamask}
            />
            <WalletIcon
              name="Wallet Connect"
              logo="/img/wallet-connect-logo.svg"
            />
            <WalletIcon
              name="Coinbase Wallet"
              logo="/img/coinbase-wallet-logo.png"
            />
          </Box>

        </Box>
      </Dialog>
    </>
  );
}

export default ConnectWallet;
