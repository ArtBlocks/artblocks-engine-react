import Page from 'components/Page';
import { useParams } from 'react-router-dom';
import TokenDetails from 'components/TokenDetails';

const TokenPage = () => {
  const { id } = useParams();

  return (
    <Page>
      {
        id && <TokenDetails id={id} /> 
      }
    </Page>
  )
}

export default TokenPage;
