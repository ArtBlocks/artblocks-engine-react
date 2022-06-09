import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme';
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default AppProvider;
