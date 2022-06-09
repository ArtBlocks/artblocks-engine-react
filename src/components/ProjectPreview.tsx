import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import Link from "@mui/material/Link";
import { Project } from "utils/types";
import useTheme from "@mui/material/styles/useTheme";
import TokenImage from "./TokenImage";

const ProjectPreview = ({
  id,
  name,
  artistName,
  invocations,
  maxInvocations,
  paused,
  complete,
  tokens,
}: Project) => {
  const theme = useTheme();

  return (
    <Paper elevation={1} sx={{
      padding: 2,
      marginBottom: 4,
    }}>
      <Box sx={{
        justifyContent: 'space-between'
      }}>
       
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <Link href={`project/${id}`}>
            <Typography variant="h5" fontWeight="bold">
              { name } 
            </Typography>
          </Link>
          <Typography sx={{
            marginLeft: 1,
            marginRight: 1,
          }}>
            •
          </Typography>
          <Typography variant="h5">
            { artistName }
          </Typography>
        </Box>
      </Box>

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

      {
        tokens && tokens.length > 0 && (
          <Box sx={{ marginTop: 2}}>
            <Grid container spacing={2}>
              {
                tokens.map(token => (
                  <Grid key={token.id} item md={3}>
                    <TokenImage tokenId={token.tokenId} width="100%" thumb />
                  </Grid>
                ))
              }
            </Grid>
          </Box>
        )
      }
    </Paper>
  )
}

export default ProjectPreview;
