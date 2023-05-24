import { useQuery, gql } from "@apollo/client"

const countOwnedTokensQuery = (projectId: string, walletAddress: string) => `
  query GetTokens {
    tokens(
      where: {
        project: "${projectId}"
        owner: "${walletAddress}"
      }
    ) {
      id
    }
  }`

const useCountOwnedTokens = (projectId: string, walletAddress: string) => {
  const { loading, error, data } = useQuery(gql(countOwnedTokensQuery(projectId, walletAddress)))

  return {
    loading,
    error,
    data
  }
}

export default useCountOwnedTokens
