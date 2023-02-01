import { useQuery, gql } from "@apollo/client"
import { TOKENS_PER_PAGE } from "config"
import { OrderDirection } from "utils/types"

interface TokensQueryParams {
  first?: number
  skip?: number
  orderDirection?: OrderDirection
}

const tokensQuery = (projectId: string, {
  first,
  skip,
  orderDirection
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
  }`

const useTokens = (projectId: string, params: TokensQueryParams) => {
  const first = params?.first || TOKENS_PER_PAGE
  const skip = params?.skip || 0
  const orderDirection = params?.orderDirection || OrderDirection.ASC

  const { loading, error, data } = useQuery(gql(tokensQuery(projectId, {
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

export default useTokens
