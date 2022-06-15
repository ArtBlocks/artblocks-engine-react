import type { AddEthereumChainParameter } from '@web3-react/types';
import { infuraKey } from 'config';

interface BasicChainInformation {
  url: string;
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

export const CHAINS: { [chainId: number]: BasicChainInformation | ExtendedChainInformation } = {
  1: {
    url: `https://mainnet.infura.io/v3/${infuraKey}`,
    name: 'Mainnet',
  },
  3: {
    url: `https://ropsten.infura.io/v3/${infuraKey}`,
    name: 'Ropsten',
  },
  4: {
    url: `https://rinkeby.infura.io/v3/${infuraKey}`,
    name: 'Rinkeby',
  },
}

export const URLS: { [chainId: number]: string } = Object.keys(CHAINS).reduce<{ [chainId: number]: string }>(
  (acc, chainId) => {
    acc[Number(chainId)] = CHAINS[Number(chainId)].url;

    return acc;
  }, {}
)
