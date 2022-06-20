import moment from 'moment';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

interface Props {
  complete: boolean;
  paused: boolean;
  activatedAt: BigInt;
}

// TODO:  show upcoming if paused and launch date is in the future
const ProjectStats = ({ complete, paused, activatedAt }: Props) => {
  const activatedDate = moment.unix(parseInt(activatedAt.toString()));

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
    }}>
      {
        paused ? (
          <Chip
            label="Paused"
            color="info"
            size="small"
            sx={{ color: 'white', marginRight: 2, }}
          />
        ) : !complete ? (
          <Chip 
            label="Live"
            color="success"
            size="small"
            sx={{ color: 'white', marginRight: 2 }}
          />
        ) : null
      }

      <Typography>
        Launched { activatedDate.format('MMM DD, YYYY') }
      </Typography>
    </Box>
  )
}

export default ProjectStats;
