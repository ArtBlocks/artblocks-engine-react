import { CONTRACT_INFO } from "config"

export const getContractConfigByAddress = (contractAddress: string) => {
   return CONTRACT_INFO.find(
        x => x.CORE_CONTRACT_ADDRESS.toLowerCase() === contractAddress.toLowerCase()
    )
}

export const getConfiguredContractAddresses = () => {
    return CONTRACT_INFO.map(x => x.CORE_CONTRACT_ADDRESS)
}
