import useTheme from "@mui/material/styles/useTheme"
import { TOKENS_PER_PAGE } from "config"
import { OrderDirection, Token } from "utils/types"
import {
  Grid,
  Link,
  Alert,
  Typography
} from "@mui/material"
import Loading from "components/Loading"
import TokenView from "components/TokenView"
import useTokens from "hooks/useTokens"
import useWindowSize from "hooks/useWindowSize"

interface Props {
  contractAddress: string
  projectId: string
  first?: number
  skip?: number
  orderDirection?: OrderDirection
  aspectRatio?: number
}

const Tokens = ({
  contractAddress,
  projectId,
  first=TOKENS_PER_PAGE,
  skip=0,
  orderDirection=OrderDirection.ASC,
  aspectRatio=1
}: Props) => {
  const theme = useTheme()
  const windowSize = useWindowSize()
  const {loading, error, data } = useTokens(projectId, {
    first,
    skip,
    orderDirection
  })

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading tokens
      </Alert>
    )
  }

  if (!data || !data.tokens) {
    return (
      <Alert severity="info">
        No tokens found for this project.
      </Alert>
    )
  }

  let width = 280
  if (windowSize && !isNaN(windowSize.width)) {
    width = windowSize.width > theme.breakpoints.values.md
      ? (Math.min(windowSize.width, 1200)-96) / 3
      : (windowSize.width-60) / 2
  }

  return (
    data.tokens.length > 0 ?
      <Grid spacing={2} container>
        {
          data.tokens.map(((token:Token) => (
            <Grid key={token.tokenId} item md={4} sm={6} xs={6}>
              <Link href={`/token/${contractAddress}/${token.tokenId}`}>
                <TokenView
                  contractAddress={contractAddress}
                  tokenId={token.tokenId}
                  aspectRatio={aspectRatio}
                  width={width}
                />
              </Link>
              <Typography mt={0.25} fontWeight="bold">
                #{token.invocation.toString()}
              </Typography>
            </Grid>
          )))
        }
      </Grid>
    : null
  )
}

export default Tokens
