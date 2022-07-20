import { JsonRpcProvider } from "@ethersproject/providers";
import { jsonRpcProviderMainnetUrl } from 'config';

const provider = new JsonRpcProvider(jsonRpcProviderMainnetUrl);

export const resolveName = async (address: string) : Promise<string | null> => {
  try {
    const name = await provider.lookupAddress(address);
    return name;
  } catch (error) {
    console.error('Error resolving ens for address', error)
    return null;
  }
}
