import {
  Box,
  Typography,
  LinearProgress
} from "@mui/material"

interface Props {
  invocations: number,
  maxInvocations: number,
  maxHasBeenInvoked: boolean
}

const MintingProgress = ({invocations, maxInvocations, maxHasBeenInvoked}: Props) => {  
  return (
    <Box sx={{marginBottom: 3}}>
      <Box>
        <Typography fontWeight="bold">
          {invocations.toString()} / {maxInvocations.toString()} minted
        </Typography>
      </Box>
      <Box sx={{marginTop: 0.5}}>
        <LinearProgress
          sx={{width: "100%", height: 15, borderRadius: 1}}
          color={maxHasBeenInvoked ? "secondary" : "primary"}
          value={(invocations/maxInvocations)*100}
          variant="determinate"
        />
      </Box>
    </Box>
  )
}

export default MintingProgress