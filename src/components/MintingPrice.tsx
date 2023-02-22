import { utils, BigNumber } from "ethers"
import {
  Box,
  LinearProgress,
  Typography
} from "@mui/material"

interface Props {
  startPriceWei: BigNumber,
  currentPriceWei: BigNumber,
  endPriceWei: BigNumber
  currencySymbol: string
}

const MintingPrice = ({startPriceWei, currentPriceWei, endPriceWei, currencySymbol}: Props) => {
  const fixedPrice = startPriceWei === endPriceWei
  const startToEnd = Number(startPriceWei.toBigInt()-endPriceWei.toBigInt())
  const startToCurrent = Number(startPriceWei.toBigInt()-currentPriceWei.toBigInt())
  return (
    <Box sx={{marginBottom: 3}}>
      <Box>
        { 
          fixedPrice ? 
          (
            <Typography fontWeight="bold">Fixed Price: {utils.formatEther(startPriceWei.toString())} {currencySymbol}</Typography>
          ) :
          (
            <Typography fontWeight="bold">Auction Price ({currencySymbol})</Typography>
          ) 
        }
      </Box>
      {
        !fixedPrice && 
        (
          <Box sx={{marginTop: 0.25}}>
          <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography fontWeight="bold">
              {utils.formatEther(startPriceWei.toString())}
            </Typography>
            <Typography fontWeight="bold">
              {utils.formatEther(endPriceWei.toString())}
            </Typography>
          </Box>
          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3}}>
            <LinearProgress
              sx={{width: "100%", height: 3, borderRadius: 1}}
              color="primary"
              value={startToCurrent/startToEnd*100}
              variant="determinate"
            />
          </Box>
        </Box>
        )
      }
    </Box>
  )
}

export default MintingPrice