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
  6284: {
    url: `https://goerli.infura.io/v3/${infuraKey}`,
    name: 'Goerli',
  },
}

export const URLS: { [chainId: number]: string } = Object.keys(CHAINS).reduce<{ [chainId: number]: string }>(
  (acc, chainId) => {
    acc[Number(chainId)] = CHAINS[Number(chainId)].url;

    return acc;
  }, {}
)

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: [chainInformation.url],
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
}