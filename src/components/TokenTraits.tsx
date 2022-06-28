import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useTokenTraits from 'hooks/useTokenTraits';
import Loading from './Loading';
import { Trait } from 'utils/types';

interface Props {
  tokenId: string;
}

const TokenTraits = ({ tokenId }: Props) => {
  const { loading, error, traits } = useTokenTraits(tokenId);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading traits
      </Alert>
    );
  }

  return (
    <TableContainer sx={{ marginBottom: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Feature</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>% Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {traits.map((trait:Trait) => {
            return (
              <TableRow key={trait.trait_type}>
                <TableCell>{ trait.trait_type }</TableCell>
                <TableCell>{ trait.value }</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
} 

export default TokenTraits;
