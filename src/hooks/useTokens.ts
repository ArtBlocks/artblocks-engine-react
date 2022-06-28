import {
  useQuery,
  gql
} from '@apollo/client';
import { tokensPerPage } from 'config';

interface TokensQueryParams {
  first?: number;
  skip?: number;
  orderDirection?: 'asc' | 'desc';
}

const tokensQuery = (projectId: string, {
  first,
  skip,
  orderDirection,
}: TokensQueryParams) => `
  query GetTokens {
    tokens(
      first: ${first},
      skip: ${skip},
      orderBy: createdAt orderDirection: ${orderDirection},
      where: {
        project: "${projectId}"
      }
    ) {
      id
      tokenId
      invocation
    }
  }`;

const useTokens = (projectId: string, params: TokensQueryParams) => {
  const first = params?.first || tokensPerPage;
  const skip = params?.skip || 0;
  const orderDirection = params?.orderDirection || 'asc'

  const { loading, error, data } = useQuery(gql(tokensQuery(projectId, {
    first,
    skip,
    orderDirection,
  })));

  return {
    loading,
    error,
    data,
  }
}

export default useTokens;
