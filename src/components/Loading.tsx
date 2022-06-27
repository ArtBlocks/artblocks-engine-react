import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => (
  <Box sx={{
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    margin: 2,
  }}>
    <CircularProgress />
  </Box>
)

export default Loading;
