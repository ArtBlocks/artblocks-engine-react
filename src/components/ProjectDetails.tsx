import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import useProject from 'hooks/useProject';
import { useWindowSize } from 'hooks/useWindowSize';
import useTheme from '@mui/material/styles/useTheme';
import TokenPreview from "./TokenPreview";
import ProjectStats from "./ProjectStats";
import Loading from "./Loading";

interface Props {
  id: string;
}

const ProjectDetails = ({ id }: Props) => {
  const { loading, error, data } = useProject(id);
  const size = useWindowSize();
  const theme = useTheme();

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading project
      </Alert>
    )
  }

  const project = data?.project;
  const token = project?.tokens[0];
  const width = size.width > theme.breakpoints.values.md
    ? (Math.min(size.width, 1200)- 48)*0.666666
      : size.width > theme.breakpoints.values.sm
        ? size.width - 48
        : size.width - 32

  let scriptJSON;
  try {
    scriptJSON = JSON.parse(project.scriptJSON);
  } catch (e) {
    console.log('Error parsing script JSON');
  }

  const {
    id: projectId,
    name, artistName,
    paused,
    complete,
    activatedAt,
    invocations,
    maxInvocations,
  } = project;
  
  return project && (
    <Box>
      <Grid spacing={2} container>
        {
          project.tokens?.length > 0 && (
            <Grid item md={8}>
              <TokenPreview
                projectId={projectId}
                tokenId={token.tokenId}
                invocation={token.invocation}
                aspectRatio={scriptJSON?.aspectRatio}
                width={width}
                showImageLink
                showLiveViewLink
              />
            </Grid>
          )
        }
        
        <Grid item md={4} xs={12} sm={12}>
          <Box sx={{ width: '100%', paddingLeft: [0, 0, 2]}}>
            <ProjectStats
              paused={paused}
              complete={complete}
              activatedAt={activatedAt}
            />
            
            <Typography variant="h4" mt={3}>
              { name } 
            </Typography>

            <Typography variant="h6" mb={2}>
              { artistName }
            </Typography>

            <Divider sx={{ display: ['block', 'none', 'none'], marginBottom: 2 }} />

            <Box sx={{ fontWeight: 'bold' }}>
              { invocations } / { maxInvocations } minted
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <LinearProgress
                sx={{ width: 'calc(100% - 32px)' }}
                value={(invocations/maxInvocations)*100}
                variant="determinate"
              />
              <Box sx={{ fontSize: 12 }}>
                { Math.floor((invocations/maxInvocations)*100) } %
              </Box>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProjectDetails;
