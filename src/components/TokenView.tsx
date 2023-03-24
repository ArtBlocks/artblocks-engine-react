import {
  Box,
  Card,
  Link
} from "@mui/material"
import TokenImage from "components/TokenImage"
import TokenLive from "components/TokenLive"

interface Props {
  tokenId: string
  width: number
  invocation?: BigInt
  aspectRatio?: number
  live?: boolean
}

const TokenView = ({
  tokenId,
  width,
  invocation,
  aspectRatio=1,
  live=false
}: Props) => {
  const height = width / aspectRatio
  return (
    <Box width={String(width)+"px"} height={String(height)+"px"}>
      <Card sx={{borderRadius: 0, boxShadow: 0}}>
        {
          live ?
          (
            <TokenLive tokenId={tokenId} width={width} height={height}/>
          ) :
          (
            <TokenImage tokenId={tokenId} width={width} height={height}/>
          )
        }
      </Card>
      { invocation !== undefined &&
        (
        <Box sx={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
          <Link href={`/token/${tokenId.split('-')[0]}/${tokenId.split('-')[1]}`} sx={{fontSize: "14px", textDecoration: "none"}}>
            No. { invocation?.toString() }
          </Link>
        </Box>
        )
      }
    </Box>
  )
}

export default TokenView
