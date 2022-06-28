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

  return traits && (
    <TableContainer sx={{ marginBottom: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Feature</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {traits.map((trait:Trait) => {
            const parts = trait.value.split(':');

            return (
              <TableRow key={parts[0]}>
                <TableCell>{ parts[0] }</TableCell>
                <TableCell>{ parts[1] }</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
} 

export default TokenTraits;
