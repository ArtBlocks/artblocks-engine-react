import {
  useQuery,
  gql
} from '@apollo/client';
import { coreContractAddress, projectsPerPage } from 'config';

interface ProjectsQueryParams {
  first?: number;
  skip?: number;
  orderDirection?: 'asc' | 'desc';
}

const projectsQuery = ({ first, skip, orderDirection }: ProjectsQueryParams) => `
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
      minterConfiguration {
        basePrice
        startPrice
        priceIsConfigured
        currencySymbol
        currencyAddress
        startTime
        endTime
      }
    }
  }`;

const useProjects = (params?: ProjectsQueryParams) => {
  const first = params?.first || projectsPerPage;
  const skip = params?.skip || 0;
  const orderDirection = params?.orderDirection || 'desc'

  const { loading, error, data } = useQuery(gql(projectsQuery({ first, skip, orderDirection })));

  return {
    loading,
    error,
    data,
  }
}

export default useProjects;