import moment from "moment"
import { 
  Box,
  Typography
} from "@mui/material"

interface Props {
  startTime?: BigInt
}

const ProjectDate = ({ startTime }: Props) => {
  const startDate = startTime ? moment.unix(parseInt(startTime.toString())) : null

  return (
    <Box sx={{display: "flex", alignItems: "center", marginTop: "5px"}}>
      {
        startDate ? 
        (
          <Typography>
            {startDate.isBefore() ? "Launched" : ""} {startDate.format("LL")}
          </Typography>
        ) :
        (
          <Typography fontStyle="italic">
            <br/>
          </Typography>
        )
      }
    </Box>
  )
}

export default ProjectDate
