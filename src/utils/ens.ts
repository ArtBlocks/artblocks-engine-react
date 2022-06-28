import { InfuraProvider } from "@ethersproject/providers";
import { CHAINS } from './chains'; 
import { expectedChainId, infuraProjectId } from 'config';

const networkName = CHAINS[expectedChainId]?.name.toLowerCase();
const provider = new InfuraProvider(networkName, infuraProjectId);

export const resolveName = async (address: string) : Promise<string | null> => {
  try {
    const name = await provider.lookupAddress(address);
    return name;
  } catch (error) {
    console.error('Error resolving ens for address', error)
    return null;
  }
}
