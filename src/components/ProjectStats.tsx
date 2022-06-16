import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

interface Props {
  complete: boolean;
  paused: boolean;
}

// TODO:  show upcoming if paused and launch date is in the future
const ProjectStats = ({ complete, paused }: Props) => {
  return (
    <Box sx={{
      display: 'flex',
      marginTop: 1,
      alignItems: 'center',
    }}>
      {
        paused ? (
          <Chip
            label="Paused"
            color="info"
            size="small"
            sx={{ color: 'white', marginRight: '8px' }}
          />
        ) : !complete ? (
          <Chip 
            label="Live"
            color="success"
            size="small"
            sx={{ color: 'white', marginRight: '8px' }}
          />
        ) : null
      }
    </Box>
  )
}

export default ProjectStats;
