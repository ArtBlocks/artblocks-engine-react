import axios from "axios"
import { useState, useEffect } from "react"
import { CORE_CONTRACT_ADDRESS, TOKEN_URL } from "config"

const useTokenTraits = (tokenId: string) => {
  const [data, setData] = useState<any | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const fetchData = async () => {
      try {
        const r = await axios.get(`${TOKEN_URL}/${CORE_CONTRACT_ADDRESS}/${tokenId}`)
        setData(r.data)
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tokenId])

  return {
    loading,
    error,
    data
  }
}

export default useTokenTraits
