export interface Project {
  id: string
  contract: Contract
  projectId: BigInt
  name: string
  description: string
  artistName: string
  artistAddress: string
  invocations: BigInt
  maxInvocations: BigInt
  activatedAt: BigInt
  scriptJSON: string
  aspectRatio: number
  active: boolean
  paused: boolean
  complete: boolean
  tokens: Token[]
  pricePerTokenInWei: BigInt
  currencyAddress: string
  currencySymbol: string
  minterConfiguration?: MinterConfiguration
}

export interface Contract {
  id: string
}

export interface Account {
  id: string
}

export interface Token {
  id: string
  tokenId: string
  invocation: BigInt
  uri: string
  createdAt: BigInt
  owner?: Account
}

export interface MinterConfiguration {
  basePrice: BigInt
  startPrice: BigInt
  priceIsconfigured: boolean
  currencySymbol: string
  currencyAddress: string,
  startTime: BigInt,
  endTime: BigInt
}

export interface Trait {
  trait_type: string
  value: string
}

export enum OrderDirection {
  ASC = "asc",
  DESC = "desc"
}
