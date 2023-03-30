import axios from "axios"
import { useState, useEffect } from "react"
import { getContractConfigByAddress } from "utils/contractInfoHelper";

const useTokenTraits = (contractAddress: string, tokenId: string) => {
  const [data, setData] = useState<any | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const contractConfig = getContractConfigByAddress(contractAddress)

  useEffect(() => {
    setLoading(true)

    const fetchData = async () => {
      try {
        const tokenUrl = contractConfig?.TOKEN_URL
        const r = await axios.get(`${tokenUrl}/${contractAddress}/${tokenId}`)
        setData(r.data)
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tokenId, contractAddress])

  return {
    loading,
    error,
    data
  }
}

export default useTokenTraits
