import { Box } from "@mui/material"

interface Props {
  auctionStartFormatted: any,
  auctionStartCountdown: any
}

const MintingCountdown = ({auctionStartFormatted, auctionStartCountdown}: Props) => {  
  return (
    <Box sx={{fontWeight: "bold", marginBottom: 0.5}}>
      Live: {auctionStartFormatted} ({auctionStartCountdown})
    </Box>
  )
}

export default MintingCountdown