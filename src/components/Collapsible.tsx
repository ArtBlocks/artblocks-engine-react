import { useState } from "react"
import {
  Box,
  Typography,
  ButtonBase
} from "@mui/material"
import ReactMarkdown from "react-markdown"

interface Props {
  content: string
  maxWords?: number
  useMarkdown?: boolean
}

const Collapsible = ({ content, maxWords=50, useMarkdown=true }: Props) => {
  const [open, setOpen] = useState(false)
  const words = content ? content.split(" ") : []
  const truncated = words.slice(0, maxWords).join(" ")
  const overflows = words.length > maxWords

  return (
    <>
      {
        useMarkdown
          ?
          <Typography component={'span'}>
            <ReactMarkdown>{open ? content : overflows ? `${truncated}...` : truncated}</ReactMarkdown>
          </Typography>
          :
          <Typography>
            {open ? content : truncated} {overflows && !open && "..."}
          </Typography>
      }
      { overflows && (
        <Box mt={1}>
          { !open && (
            <ButtonBase
              onClick={() => setOpen(true)}
              sx={{ textDecoration: "underline", textTransform: "none" }}
            >
              More
            </ButtonBase>
          )}
        </Box>
      )}
    </>
  )
}

export default Collapsible
