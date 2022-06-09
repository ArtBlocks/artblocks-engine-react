import {
  useQuery,
  gql
} from '@apollo/client';
import { coreContractAddress } from 'config';

const PROJECTS_QUERY = `
  query GetProjects {
    projects( where: { contract: "${coreContractAddress?.toLowerCase()}" }) {
      id
      invocations
      artistName
      name
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