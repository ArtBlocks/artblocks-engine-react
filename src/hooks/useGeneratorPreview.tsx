import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { CONTRACT_INFO } from 'config'
import { Project } from 'utils/types'

interface TokenData {
  tokenId: number
  hash: string
}

const generateToken = (p: number): TokenData => {
  let hash = '0x'
  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random()*16).toString(16)
  }
  return {
    hash,
    tokenId: p * 1000000 + Math.floor(Math.random()*1000)
  }
}

const useGeneratorPreview = (project: Project) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const contractConfig = CONTRACT_INFO.filter(
      x => x.CORE_CONTRACT_ADDRESS.toLowerCase() == project.contract.id.toLowerCase()
  )

  const refreshPreview = useCallback(async () => {
    setLoading(true)
    try {
      const token = generateToken(Number(project.projectId))
      const generatorUrl = contractConfig[0].GENERATOR_URL
      const { data } = await axios.get(`${generatorUrl}/${project.id}/${token.tokenId}/${token.hash}`)
      setContent(data)
      setError(false)
    } catch(error) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [project])

  useEffect(() => {
    refreshPreview()
  }, [refreshPreview])

  return {
    content,
    loading,
    error,
    refreshPreview
  }
}

export default useGeneratorPreview
