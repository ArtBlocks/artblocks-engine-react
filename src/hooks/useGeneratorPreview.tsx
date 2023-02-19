import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { GENERATOR_URL } from 'config'
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

  const refreshPreview = useCallback(async () => {
    setLoading(true)
    try {
      const token = generateToken(Number(project.projectId))
      const { data } = await axios.get(`${GENERATOR_URL}/${project.id}/${token.tokenId}/${token.hash}`)
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