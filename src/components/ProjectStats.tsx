import moment from 'moment';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

interface Props {
  complete: boolean;
  paused: boolean;
  startTime?: BigInt;
}

const ProjectStats = ({ complete, paused, startTime }: Props) => {
  const startDate = startTime ? moment.unix(parseInt(startTime.toString())) : null;

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
    }}>
      {
        startDate?.isAfter() ? 
        <Chip
          label="Upcoming"
          color="upcoming"
          size="small"
          sx={{ color: 'white', marginRight: 2, }}
        />
        : paused ? (
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

      {
        startDate && (
          <Typography>
            { startDate.isBefore() ? 'Launched' : '' } { startDate.format('MMM DD, YYYY') }
          </Typography>
        )
      }
    </Box>
  )
}

export default ProjectStats;
