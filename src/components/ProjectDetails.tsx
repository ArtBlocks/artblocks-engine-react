import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import useProject from "hooks/useProject";
import TokenPreview from "./TokenPreview";
import ProjectStats from "./ProjectStats";
import { useWindowSize } from "hooks/useWindowSize";

interface Props {
  id: string;
}

const ProjectDetails = ({ id }: Props) => {
  const { loading, error, data } = useProject(id);
  const ws = useWindowSize();
  const size = ws.width >= 600 ? Math.min(ws.width*.4 - 24, 440) : ws.width - 32;

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading project
      </Alert>
    )
  }

  const project = data?.project; 
  
  return project && (
    <Box>
      <Grid container>
        {
          project.tokens?.length > 0 && (
            <Grid item sm={5}>
              <TokenPreview
                projectId={project.id}
                tokenId={project.tokens[0].tokenId}
                width={size}
                height={size}
              />
              <Box sx={{
                width: size,
                textAlign: 'center',
                marginTop: 1,
                marginBottom: 3,
              }}>
                mint # {project.tokens[0].tokenId }
              </Box>
            </Grid>
          )
        }
        
        <Grid item sm={7}>
          <Typography variant="h2" fontWeight="bold">
            { project.name } 
          </Typography>
          
          <Typography variant="h5">
            { project.artistName }
          </Typography>

          <ProjectStats
            paused={project.paused}
            complete={project.complete}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProjectDetails;
