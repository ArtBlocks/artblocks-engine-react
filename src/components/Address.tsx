import { useState, useEffect, useCallback } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { resolveName } from 'utils/ens';

interface AddressProps {
  address: string;
};

const Address = ({ address }: AddressProps) => {
  const [ensName, setEnsName] = useState<string | null>('');

  const resolveEns = useCallback(async () => {
    try {
      const name = await resolveName(address);
      setEnsName(name);
    } catch(error) {
      console.log('Error resolving ens', error)
    }
  }, [address]);

  useEffect(() => {
    resolveEns();
  });

  const shortAddress = address ? `${address.slice(0, 6)}...${ address.slice(38, 42)}` : null;

  return (
    address !== null ?
    <Tooltip title={address}>
      <span>{ ensName || shortAddress }</span>
    </Tooltip>
    : null
  )
}

export default Address;
