import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={
        {
          width: '100%',
          maxWidth: 1170,
          display: 'flex',
          margin: 'auto',
        }
      }>
        <Typography variant="h6" color="inherit" noWrap>
          PBAB
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
