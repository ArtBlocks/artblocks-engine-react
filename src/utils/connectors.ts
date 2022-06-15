import { initializeConnector } from '@web3-react/core';
import { Actions } from '@web3-react/types';
import { MetaMask } from '@web3-react/metamask';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { WalletConnect } from '@web3-react/walletconnect';
import { URLS } from 'utils/chains';

export const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>((actions:Actions ) => new MetaMask({ actions }));

export const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        rpc: URLS,
      },
    })
)

export const [coinbaseWallet, coinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: URLS[1][0],
        appName: 'web3-react',
      },
    })
)
