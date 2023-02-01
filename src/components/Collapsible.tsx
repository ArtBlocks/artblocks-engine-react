import { useState } from "react"
import {
  Box,
  Typography,
  ButtonBase
} from "@mui/material"

interface Props {
  content: string
  maxWords?: number
}

const Collapsible = ({ content, maxWords=100 }: Props) => {
  const [open, setOpen] = useState(false)
  const words = content ? content.split(" ") : []
  const truncated = words.slice(0, maxWords).join(" ")
  const overflows = words.length > maxWords

  return (
    <>
      <Typography>
        {open ? content : truncated} {overflows && !open && "..."}
      </Typography>
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
