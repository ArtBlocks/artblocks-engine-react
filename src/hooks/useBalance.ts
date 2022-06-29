import { useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { ERC20__factory } from 'contracts';
import { useWeb3React } from '@web3-react/core';


export function useBalance(
  tokenAddress: string,
): {
  balance: BigNumber | undefined,
  loading: boolean,
  error: boolean,
} {
  const { account, provider } = useWeb3React();
  const signer = provider!.getSigner(account);
  const tokenContract = signer ? ERC20__factory.connect(tokenAddress, signer) : null;
  
  const [balance, setBalance] = useState<BigNumber | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchBalance = async () => {
    try {
      const b = await tokenContract?.balanceOf(account || '');
      setBalance(b);
    } catch(error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  
  useState(() => {
    fetchBalance();
  });

  return {
    balance,
    loading,
    error,
  };
}
