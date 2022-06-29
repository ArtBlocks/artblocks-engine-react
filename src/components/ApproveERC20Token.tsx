import { useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useQueryClient } from 'react-query';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useApproveToken } from 'hooks/useApproveToken';
import { notifyTx } from 'utils/notifications';
import { ERC20Token } from 'utils/types';
import Loading from './Loading';
import { isDev } from 'config';

interface ApproveTokenProps {
  children: JSX.Element;
  amount: BigNumber;
  spendingContractAddress: string;
  paymentToken: ERC20Token;
  approveLabel: string;
  chainId: number;
  expectedChainId: number;
  useExact?: boolean;
}

const ApproveERC20 = ({
  children,
  amount,
  paymentToken,
  spendingContractAddress,
  approveLabel,
  chainId,
}:ApproveTokenProps) => {
  const { approvalState, isApproved, approve, revokeApproval } = useApproveToken(
    paymentToken,
    amount,
    spendingContractAddress,
    chainId,
  );
  const { account } = useWeb3React();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries(['approval', paymentToken.address, account]);
    setPending(false);
  }, [queryClient, paymentToken.address, account]);

  const onApprove = useCallback(async () => {
    notifyTx({
      method: approve,
      chainId,
      success: 'Token approved.',
      error: 'An error occured while trying to approve token.',
      onSubmitted: () => setPending(true),
      onError: () => setPending(false),
      onSuccess,
    });
  }, [chainId, approve, onSuccess]);

  const onRevokeApproval = useCallback(async () => {
    notifyTx({
      method: revokeApproval,
      chainId,
      success: 'Approval revoked',
      onSubmitted: () => setPending(true),
      onError: () => setPending(false),
      onSuccess,
      error: 'An error occured while trying to remove approval for token.',
    });
  }, [chainId, revokeApproval, onSuccess]);

  if (approvalState === 'UNKNOWN') {
    return <Loading />
  }

  return (
    <>
      {
        isApproved ? (
          <Box sx={{ display: 'flex' }}>
            { children }
            { isDev && (
              <Button
                disabled={pending}
                sx={{ marginLeft: 2 }}
                onClick={onRevokeApproval}
                variant="contained"
                color="warning"
              >
                [DEV] Revoke approval
              </Button>
            )}
          </Box>
        ) : (
          <Button
            disabled={pending}
            onClick={onApprove}
            variant="contained"
            color="primary"
          >
            { approveLabel }
          </Button>
        )
      }
    </>
  )
}

export default ApproveERC20;
