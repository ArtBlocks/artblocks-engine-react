import axios from "axios"
import { useState, useEffect } from "react"
import { CONTRACT_INFO } from "config"

const useTokenTraits = (contractAddress: string, tokenId: string) => {
  const [data, setData] = useState<any | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const fetchData = async () => {
      try {
        const tokenUrl = CONTRACT_INFO[contractAddress].TOKEN_URL
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
