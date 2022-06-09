import useTheme from "@mui/system/useTheme";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  complete: boolean;
  paused: boolean;
  invocations: BigInt;
  maxInvocations: BigInt;
}

const ProjectStats = ({ complete, paused, invocations, maxInvocations }: Props) => {
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      marginTop: 1,
    }}>
      {
        complete ? (
          <Typography fontWeight="bold" sx={{
            marginRight: 1,
            color: theme.palette.success.main
          }}>
            Completed •
          </Typography>
        ) : paused ? (
          <Typography fontWeight="bold" sx={{
            marginRight: 1,
            color: theme.palette.info.main
          }}>
            Paused •
          </Typography>
        ) : null
      }
      <Box>
        { invocations?.toString() } of { maxInvocations?.toString() }
      </Box>
    </Box>
  )
}

export default ProjectStats;
