import { useState } from "react"
import {
  Box,
  CircularProgress
} from "@mui/material"
import { Container } from "@mui/system"
import useInterval from "hooks/useInterval"

const Loading = () => {
  const [waitTime, setWaitTime] = useState(0)

  useInterval(() => {
    setWaitTime(waitTime+1)
  }, 1000)

  return (
    <Container>
      {
        waitTime > 0 &&
        (
          <Box display="flex" alignItems="center" justifyContent="center" width="100%">
            <CircularProgress/>
          </Box>
        )
      }
    </Container>
  )
}

export default Loading