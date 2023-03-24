import { Trait } from "utils/types"
import {
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"
import Loading from "components/Loading"
import useTokenTraits from "hooks/useTokenTraits"

interface Props {
  contractAddress: string
  tokenId: string
}

const TokenTraits = ({ contractAddress, tokenId }: Props) => {
  const { loading, error, data } = useTokenTraits(contractAddress, tokenId)
  const traits = data?.traits?.filter((t:Trait) => t.value.indexOf('All') === -1)

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading traits
      </Alert>
    )
  }

  return traits && traits.length > 0 && (
    <TableContainer sx={{marginBottom: 4}}>
      <Typography variant="h6" mb={2}>Features</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography fontWeight={600}>
                Feature
              </Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight={600}>
                Value
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {traits.map((trait:Trait) => {
            const p = trait.value.split(":")
            return (
              <TableRow key={p[0]}>
                <TableCell>
                  <Typography>
                    {p[0]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {p[1]}
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TokenTraits
