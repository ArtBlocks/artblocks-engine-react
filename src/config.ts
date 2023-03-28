export const EXPECTED_CHAIN_ID = Number(process.env.REACT_APP_EXPECTED_CHAIN_ID)
export const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL
export const INFURA_KEY = process.env.REACT_APP_INFURA_KEY || ""
export const PROJECTS_PER_PAGE = 8
export const TOKENS_PER_PAGE = 9
export const MULTIPLY_GAS_LIMIT = 1.1
export const CONTRACT_INFO = [
    {
        "CORE_CONTRACT_ADDRESS": "0xa319c382a702682129fcbf55d514e61a16f97f9c",
        "MINT_CONTRACT_ADDRESS": "0x463b8ced7d22a55aa4a5d69ef6a54a08aa0feb93",
        "MEDIA_URL": "https://plottables-mainnet.s3.amazonaws.com",
        "TOKEN_URL": "https://token.artblocks.io",
        "GENERATOR_URL": "https://generator.artblocks.io"
    },
    {
        "CORE_CONTRACT_ADDRESS": "0x18de6097ce5b5b2724c9cae6ac519917f3f178c0",
        "MINT_CONTRACT_ADDRESS": "0xe6e728361b7c824cba64cc1e5323efb7a5bb65da",
        "MEDIA_URL": "https://plottables-flex-mainnet.s3.amazonaws.com",
        "TOKEN_URL": "https://token.artblocks.io",
        "GENERATOR_URL": "https://generator.artblocks.io"
    }
]
