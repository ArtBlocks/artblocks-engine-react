import { useQuery, gql } from "@apollo/client"
import { TOKENS_PER_PAGE } from "config"
import { OrderDirection } from "utils/types"

interface Params {
  first?: number
  skip?: number
  orderDirection?: OrderDirection
}

const ownedTokensQuery = (projectId: string, walletAddress: string, {
  first,
  skip,
  orderDirection
}: Params) => `
  query GetTokens {
    tokens(
      first: ${first},
      skip: ${skip},
      orderBy: createdAt orderDirection: ${orderDirection},
      where: {
        project: "${projectId}"
        owner: "${walletAddress}"
      }
    ) {
      id
      tokenId
      invocation
    }
  }`

const useOwnedTokens = (projectId: string, walletAddress: string, params: Params) => {
  const first = params?.first || TOKENS_PER_PAGE
  const skip = params?.skip || 0
  const orderDirection = params?.orderDirection || OrderDirection.ASC

  const { loading, error, data } = useQuery(gql(ownedTokensQuery(projectId, walletAddress,{
    first,
    skip,
    orderDirection
  })))

  return {
    loading,
    error,
    data
  }
}

export default useOwnedTokens
