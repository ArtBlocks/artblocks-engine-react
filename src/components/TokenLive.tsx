import axios from "axios"
import { useState } from "react"
import { CONTRACT_INFO } from "config"
import {
  Box,
  Typography
} from "@mui/material"
import Loading from "components/Loading"
import TokenImage from "components/TokenImage"
import useInterval from "hooks/useInterval"

interface Props {
  contractAddress: string
  tokenId: string
  width: number
  height: number
}

const TokenLive = ({contractAddress, tokenId, width, height}: Props) => {
  const [status, setStatus] = useState(404)
  const [pollingTime, setPollingTime] = useState(0)
  const [pollingDelay, setPollingDelay] = useState(0)
  const [pollingAttempts, setPollingAttempts] = useState(0)
  const contractConfig = CONTRACT_INFO.filter(
      x => x.CORE_CONTRACT_ADDRESS.toLowerCase() == contractAddress.toLowerCase()
  )
  const generatorUrl = contractConfig[0].GENERATOR_URL
  const endpoint = `${generatorUrl}/${contractAddress.toLowerCase()}/${tokenId}`

  useInterval(() => {
    setPollingTime(pollingTime+1)
  }, 1000)

  useInterval(() => {
    setPollingDelay(pollingDelay+3)
    if (status === 404) {
      axios
      .get(endpoint)
      .then(function(response) {
        setStatus(response.status)
      })
      .catch((error) => {
        setStatus(404)
      })
      .finally(() => {
        setPollingAttempts(pollingAttempts+1)
      })
    }
  }, 1000*pollingDelay)

  if (pollingAttempts === 0) {
    return (
      <Box width={String(width)+"px"} height={String(height)+"px"}></Box>
    )
  }

  if (pollingTime > 500) {
    return (
      <TokenImage contractAddress={contractAddress} tokenId={tokenId} width={width} height={height}/>
    )
  }

  return (
    <Box>
      {
        status === 200 ?
        (
          <iframe
            title={tokenId}
            src={endpoint}
            width={String(width)+"px"}
            height={String(height)+"px"}
            frameBorder={"0"}
          />
        ) :
        (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={String(width)+"px"}
            height={String(height)+"px"}
          >
            <Box>
              <Loading/>
              <Typography>Waiting for indexing ({pollingTime})</Typography>
            </Box>
          </Box>
        )
      }
    </Box>
  )
}

export default TokenLive
