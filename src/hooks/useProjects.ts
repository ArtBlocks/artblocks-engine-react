import {
  useQuery,
  gql
} from '@apollo/client';
import { coreContractAddress } from 'config';

interface ProjectsQueryParams {
  first?: number;
  skip?: number;
}

const projectsQuery = ({ first, skip }: ProjectsQueryParams) => `
  query GetProjects {
    projects(
        where: { contract: "${coreContractAddress?.toLowerCase()}" }
        first: ${first}
        skip: ${skip}
        orderBy: createdAt orderDirection: desc
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
      currencyAddress
      currencySymbol
      createdAt
      activatedAt
      tokens (first:4 orderBy: createdAt orderDirection: desc) {
        id
        tokenId
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