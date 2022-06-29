import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ContractTransaction, ContractReceipt } from '@ethersproject/contracts';
import { confirmations as numConfirmations, etherscanBaseUrl } from 'config';

const displayError = (customError:any, error:any) => (
  <>
    <Typography fontSize="16px" fontWeight="bold">{ customError }</Typography>
    <Typography fontSize="14px">{ error }</Typography>
  </>
)

const displayMessage = (message:string, txLink:string) => (
  <>
    <Box mb={2}>
      { message }
    </Box>
    <Box fontSize="14px" textAlign="right">
      <a href={txLink} target="_blank" rel="noopener noreferrer">
        View in explorer
      </a>
    </Box>
  </>
)

const formatError = (err:any) => {
  console.log({ err })
  if (typeof err === 'string') {
    return err
  }
  if (err.data?.message && typeof err.data?.message === 'string') {
    return err.data?.message;
  }
  if (err.message && typeof err.message === 'string') {
    return err.message
  }
  return 'Unexpected error';
}

interface NotificationParams {
  pending?: string;
  submitted?: string;
  success?: string;
  error?: string;
  confirmations?: number;
  method: () => Promise<ContractTransaction>;
  chainId: number;
  onSubmitted?: () => void;
  onSuccess?: (res?:ContractReceipt) => void;
  onError?: (err?:any) => void;
}

export const notifyTx = async ({
  pending='Waiting for your confirmation',
  submitted='Your transaction was submitted',
  success='Transaction succeeded',
  error='Your transaction failed',
  method,
  confirmations=numConfirmations || 3,
  onSubmitted,
  onSuccess,
  onError,
}: NotificationParams) => {
  const toastId = toast.loading(pending);
  try {
    const res = await method();
    const txLink = `${etherscanBaseUrl}/tx/${res.hash}`;
    toast.update(toastId, {
      render: displayMessage(submitted, txLink),
      type: toast.TYPE.INFO,
    });
    onSubmitted && onSubmitted();
    const receipt = await res.wait(confirmations);
    if (receipt.status === 1) {
      toast.update(toastId, {
        render: displayMessage(success, txLink),
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 10000,
      });
      onSuccess && onSuccess(receipt);
    } else {
      throw new Error();
    }
  } catch (err) {
    toast.update(toastId, {
      render: displayError(error, formatError(err)),
      type: toast.TYPE.ERROR,
      isLoading: false,
      autoClose: 10000,
    });
    onError && onError(err);
  }
}
