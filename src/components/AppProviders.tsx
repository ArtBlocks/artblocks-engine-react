import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import {
  metaMask,
  metaMaskHooks,
  walletConnect,
  walletConnectHooks,
  coinbaseWallet,
  coinbaseWalletHooks,
} from 'utils/connectors';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import theme from 'theme';
import { graphQLURL } from 'config';

const connectors: [MetaMask | WalletConnect | CoinbaseWallet, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
]

const client = new ApolloClient({
  uri: graphQLURL,
  cache: new InMemoryCache(),
});

interface Props {
  children: React.ReactNode;
}

const AppProvider = ({ children }:Props) => {
  return (
    <Web3ReactProvider connectors={connectors}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          { children }
        </ThemeProvider>
      </ApolloProvider>
    </Web3ReactProvider>
  );
}

export default AppProvider;
