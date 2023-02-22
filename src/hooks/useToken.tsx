import { useQuery, gql } from "@apollo/client"

const tokenQuery = (id: string) => `
  query GetToken {
    token(
      id: "${id}"
    ) {
      id
      tokenId
      invocation
      createdAt
      uri
      owner {
        id
      }
      project {
        id
        projectId
        name
        artistName
        artistAddress
        scriptJSON
      }
    }
  }`

const useToken = (id: string) => {
  const { loading, error, data } = useQuery(gql(tokenQuery(id)))

  return {
    loading,
    error,
    data
  }
}

export default useToken
