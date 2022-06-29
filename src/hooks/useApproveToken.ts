import { useCallback, useMemo } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { ContractTransaction } from '@ethersproject/contracts';
import { useQuery } from 'react-query';
import { ERC20Token } from 'utils/types';
import { ERC20__factory } from 'contracts';
import { useWeb3React } from '@web3-react/core';

export const TRANSACTION_SUCCESS = {
  type: 'success',
  message:
    'Your transaction has succeeded. The UI may take a few moments to reflect the changes.',
  autoDismiss: 10000,
};

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  APPROVED = 'APPROVED',
}

export function useApproveToken(
  token: ERC20Token,
  amountToApprove?: BigNumber,
  spender?: string,
  expectedChainId?: number,
  queryOptions?: any
): {
  approvalState: ApprovalState;
  approve: () => Promise<ContractTransaction>;
  revokeApproval: () => Promise<ContractTransaction>;
  isApproved: boolean;
} {
  const { account, provider, chainId } = useWeb3React();
  const signer = provider!.getSigner();
  const tokenContract = signer ? ERC20__factory.connect(token.address, signer) : null;
  const tokenOwner = account ?? '';

  const { data: currentAllowance } = useQuery(
    ['allowance', token?.address, tokenOwner],
    async () => {
      return await tokenContract!.allowance(tokenOwner, spender || '')
    },
    {
      enabled:
        Boolean(tokenContract) &&
        Boolean(tokenOwner) &&
        Boolean(spender) &&
        Boolean(chainId === expectedChainId),
      refetchInterval: 1000,
      ...queryOptions,
    }
  );

  let approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    return currentAllowance.lt(amountToApprove)
      ? ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, spender]);

  const approve = useCallback(async (): Promise<ContractTransaction> => {;

    if (approvalState === ApprovalState.APPROVED) {
      throw Error('Unnecessary approval');
    }

    if (!token) {
      throw Error('Missing token');
    }

    if (!tokenContract) {
      throw Error('No token contract, check network');
    }

    if (!amountToApprove) {
      throw Error('Missing amount to approve');
    }

    if (!spender) {
      throw Error('Missing spender');
    }

    if (approvalState === ApprovalState.UNKNOWN) {
      throw Error('Not ready');
    }

    if (chainId !== expectedChainId) throw new Error('Wrong network');

    let gasLimit;
    gasLimit = await tokenContract.estimateGas.approve(spender, amountToApprove.toString());

    try {
      return tokenContract.approve(
        spender,
        amountToApprove.toString(),
        {
          gasLimit,
        }
      );
    } catch (e) {
      console.log('Token approval failed', e);
      throw e;
    }
  }, [
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    chainId,
    expectedChainId,
  ]);

  const revokeApproval = useCallback(async (): Promise<ContractTransaction> => {
    if (approvalState === ApprovalState.NOT_APPROVED) {
      throw Error('Revoke approval not necessary');
    }

    if (!tokenContract) {
      throw Error('Missing tokenContract');
    }

    if (!token) {
      throw Error('Missing token');
    }

    if (approvalState === ApprovalState.UNKNOWN) {
      throw Error('Not ready');
    }

    if (!spender) {
      throw Error('Missing spender');
    }

    const estimatedGas = await tokenContract.estimateGas.approve(spender, BigNumber.from(0));

    try {
      return tokenContract.approve(spender, BigNumber.from(0), {
        gasLimit: estimatedGas,
      });
    } catch (e) {
      console.log('Failed to revoke approval', e);
      throw e;
    }
  }, [approvalState, token, tokenContract, spender]);

  return {
    approvalState,
    approve,
    revokeApproval,
    isApproved: approvalState === ApprovalState.APPROVED,
  };
}
