import { useQuery, gql } from "@apollo/client"
import { PROJECTS_PER_PAGE } from "config"
import { OrderDirection } from "utils/types"
import { getConfiguredContractAddresses } from "utils/contractInfoHelper"

interface Params {
  first?: number
  skip?: number
  orderDirection?: OrderDirection
}

const ownedProjectsQuery = (walletAddress: string, { first, skip, orderDirection }: Params) => `
  query GetProjects {
    projects(
        where: {
          contract_in: ["${getConfiguredContractAddresses().join("\",\"").toLowerCase()}"]
          active: true
        }
        first: ${first}
        skip: ${skip}
        orderBy: createdAt
        orderDirection: ${orderDirection}
    ) {
      id
      contract {
        id
      }
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
      aspectRatio
      currencyAddress
      currencySymbol
      createdAt
      activatedAt
      tokens (
        where: {
          owner: "${walletAddress}"
        }
        first: 2
      ) {
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

const useOwnedProjects = (walletAddress: string, params?: Params) => {
  const first = params?.first || PROJECTS_PER_PAGE
  const skip = params?.skip || 0
  const orderDirection = params?.orderDirection || OrderDirection.DESC
  const { loading, error, data } = useQuery(gql(ownedProjectsQuery(walletAddress, { first, skip, orderDirection })))

  return {
    loading,
    error,
    data
  }
}

export default useOwnedProjects
