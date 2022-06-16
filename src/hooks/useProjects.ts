import {
  useQuery,
  gql
} from '@apollo/client';
import { coreContractAddress } from 'config';

interface ProjectsQueryParams {
  first?: number;
  skip?: number;
  orderDirection?: 'asc' | 'desc';
}

const projectsQuery = ({ first, skip, orderDirection='desc' }: ProjectsQueryParams) => `
  query GetProjects {
    projects(
        where: {
          contract: "${coreContractAddress?.toLowerCase()}"
          active: true
        }
        first: ${first}
        skip: ${skip}
        orderBy: createdAt orderDirection: ${orderDirection}
    ) {
      id
      name
      description
      license
      locked
      pricePerTokenInWei
      active
      paused
      complete
      artistName
      invocations
      maxInvocations
      scriptJSON
      currencyAddress
      currencySymbol
      createdAt
      activatedAt
      tokens (first:10 orderBy: createdAt orderDirection: desc) {
        id
        tokenId
        invocation
      }
    }
  }`;

const useProjects = (params?: ProjectsQueryParams) => {
  const first = params?.first || 10;
  const skip = params?.skip || 0;

  const { loading, error, data } = useQuery(gql(projectsQuery({ first, skip })));

  return {
    loading,
    error,
    data,
  }
}

export default useProjects;