import { useQuery, gql } from "@apollo/client"
import { CORE_CONTRACT_ADDRESS, PROJECTS_PER_PAGE } from "config"
import { OrderDirection } from "utils/types"

interface ProjectsQueryParams {
  first?: number
  skip?: number
  orderDirection?: OrderDirection
}

const projectsQuery = ({ first, skip, orderDirection }: ProjectsQueryParams) => `
  query GetProjects {
    projects(
        where: {
          contract: "${CORE_CONTRACT_ADDRESS?.toLowerCase()}"
        }
        first: ${first}
        skip: ${skip}
        orderBy: createdAt orderDirection: ${orderDirection}
    ) {
      id
      projectId
      name
      description
      license
      locked
      pricePerTokenInWei
      active
      paused
      complete
      artistName
      artistAddress
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
  }`

const useProjects = (params?: ProjectsQueryParams) => {
  const first = params?.first || PROJECTS_PER_PAGE
  const skip = params?.skip || 0
  const orderDirection = params?.orderDirection || OrderDirection.DESC
  const { loading, error, data } = useQuery(gql(projectsQuery({ first, skip, orderDirection })))

  return {
    loading,
    error,
    data
  }
}

export default useProjects