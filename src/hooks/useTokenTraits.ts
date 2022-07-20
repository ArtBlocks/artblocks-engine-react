import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trait } from 'utils/types';
import { coreContractAddress, tokenUrl } from 'config';


const useTokenTraits = (tokenId: string) => {
  const [tokenData, setTokenData] = useState<any | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchTokenData = async () => {
      try {
        const { data } = await axios.get(`${tokenUrl}/${coreContractAddress}/${tokenId}`);
        setTokenData(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchTokenData();
  }, [ tokenId ]);

  const traits = tokenData?.traits?.filter((t:Trait) => t.value.indexOf('All') === -1);

  return {
    traits,
    error,
    loading,
  }
}

export default useTokenTraits;
