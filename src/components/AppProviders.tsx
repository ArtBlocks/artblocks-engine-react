import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import { graphQLURL } from 'config';

const client = new ApolloClient({
  uri: graphQLURL,
  cache: new InMemoryCache(),
});

interface Props {
  children: React.ReactNode;
}

const AppProvider = ({ children }:Props) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}

export default AppProvider;
