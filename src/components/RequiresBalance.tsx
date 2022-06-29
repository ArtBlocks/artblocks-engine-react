import Alert from '@mui/material/Alert';
import Loading from 'components/Loading';
import { BigNumber } from 'ethers';
import { useBalance } from 'hooks/useBalance';
import { ERC20Token } from 'utils/types';

interface Props {
  children: JSX.Element;
  amount: BigNumber;
  paymentToken: ERC20Token;
}


const RequiresBalance = ({ children, amount, paymentToken }: Props) => {
  const { balance, loading, error } = useBalance(paymentToken.address);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error getting balance
      </Alert>
    );
  }

  if (balance && balance.lt(amount)) {
    return (
      <Alert severity="warning">
        Insufficient { paymentToken.symbol } balance
      </Alert>
    )
  }

  return children;
}

export default RequiresBalance;
