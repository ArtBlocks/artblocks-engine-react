import {
  useQuery,
  gql
} from '@apollo/client';
import { coreContractAddress } from 'config';

const PROJECTS_QUERY = `
  query GetProjects {
    projects( where: { contract: "${coreContractAddress?.toLowerCase()}" }) {
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
    }
  }`;

const useProjects = () => {
  const { loading, error, data } = useQuery(gql(PROJECTS_QUERY));

  return {
    loading,
    error,
    data,
  }
}

export default useProjects;