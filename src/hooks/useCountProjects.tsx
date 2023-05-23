import { useQuery, gql } from "@apollo/client"
import { getConfiguredContractAddresses } from "utils/contractInfoHelper"

const countProjectsQuery = () => `
  query GetProjects {
    projects(
        where: {
          contract_in: ["${getConfiguredContractAddresses().join("\",\"").toLowerCase()}"]
          active: true
        }
    ) {
      id
    }
  }`

const useCountProjects = () => {
  const { loading, error, data } = useQuery(gql(countProjectsQuery()))

  return {
    loading,
    error,
    data
  }
}

export default useCountProjects
