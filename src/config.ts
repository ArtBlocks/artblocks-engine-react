import { mainnetContractConfig, testnetContractConfig } from "./contractConfig";

export const EXPECTED_CHAIN_ID = Number(process.env.REACT_APP_EXPECTED_CHAIN_ID)
export const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL
export const WALLET_CONNECT_PROJECT_ID = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || ""
export const INFURA_KEY = process.env.REACT_APP_INFURA_KEY || ""
export const PROJECTS_PER_PAGE = 8
export const TOKENS_PER_PAGE = 9
export const MULTIPLY_GAS_LIMIT = 1.1
export const CONTRACT_INFO = EXPECTED_CHAIN_ID === 1 ? mainnetContractConfig : testnetContractConfig
export const MERKLE_PROOF_API_URL = process.env.REACT_APP_MERKLE_PROOF_API_URL || ""
export const HOLDER_PROOF_API_URL = process.env.REACT_APP_HOLDER_PROOF_API_URL || ""
