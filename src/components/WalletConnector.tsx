import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Connector } from '@web3-react/types';
import { Web3ReactHooks } from '@web3-react/core';
import { expectedChainId } from 'config';
import { WalletConnect } from '@web3-react/walletconnect';
import { getAddChainParameters } from 'utils/chains';

interface Props {
  name: string;
  logo: string;
  width?: number | string;
  connector: Connector;
  hooks: Web3ReactHooks;
  onError: (error:string | undefined) => void;
  onSuccess: () => void;
}

const formatError = (error:any): string => {
  if (error && error.message) {
    return error.message;
  }
  return 'Unexpected error';
}

const WalletConnector = ({ name, logo, width=100, connector, hooks, onError, onSuccess, ...styles }: Props) => {
  const connect = useCallback(async () => {
    onError(undefined)
    try {
      if (connector instanceof WalletConnect) {
        await connector.activate(expectedChainId)
      } else {
        await connector.activate(getAddChainParameters(expectedChainId))
      }
      onSuccess();
    } catch (error) {
      onError(formatError(error));
    }
  }, [connector, onError, onSuccess])

  return (
    <ButtonBase disableRipple sx={{ cursor: 'pointer' }} onClick={connect}>
      <Box
        sx={{
          height: 160,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          cursor: 'pointer',
          margin: 2,
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
}

export default WalletConnector;
