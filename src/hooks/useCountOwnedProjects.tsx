import { useQuery, gql } from "@apollo/client"
import { getConfiguredContractAddresses } from "utils/contractInfoHelper"

const countOwnedProjectsQuery = (walletAddress: string) => `
  query GetProjects {
    projects(
        where: {
          contract_in: ["${getConfiguredContractAddresses().join("\",\"").toLowerCase()}"]
          active: true
        }
    ) {
      id
      tokens (
        where: {
          owner: "${walletAddress}"
        }
        first: 1
      ) {
        id
        tokenId
        invocation
      }
    }
  }`

const useCountOwnedProjects = (walletAddress: string) => {
  const { loading, error, data } = useQuery(gql(countOwnedProjectsQuery(walletAddress)))

  return {
    loading,
    error,
    data
  }
}

export default useCountOwnedProjects
