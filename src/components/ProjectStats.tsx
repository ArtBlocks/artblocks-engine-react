import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

interface Props {
  complete: boolean;
  paused: boolean;
  invocations: BigInt;
  maxInvocations: BigInt;
}

const ProjectStats = ({ complete, paused, invocations, maxInvocations }: Props) => {
  return (
    <Box sx={{
      display: 'flex',
      marginTop: 1,
      alignItems: 'center',
    }}>
      {
        paused ? (
          <Chip label="Paused" color="info" sx={{ color: 'white', marginRight: '8px' }} />
        ) : !complete ? (
          <Chip label="Live" color="success" sx={{ color: 'white', marginRight: '8px' }} />
        ) : null
      }
      <Box>
        { invocations?.toString() } of { maxInvocations?.toString() }
      </Box>
    </Box>
  )
}

export default ProjectStats;
