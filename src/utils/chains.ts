import type { AddEthereumChainParameter } from '@web3-react/types';
import { jsonRpcProviderMainnetUrl, jsonRpcProviderRopstenUrl, jsonRpcProviderGoerliUrl } from 'config';

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
    url: jsonRpcProviderMainnetUrl,
    name: 'Mainnet',
  },
  3: {
    url: jsonRpcProviderRopstenUrl,
    name: 'Ropsten',
  },
  5: {
    url: jsonRpcProviderGoerliUrl,
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