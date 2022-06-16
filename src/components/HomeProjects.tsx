import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Masonry from '@mui/lab/Masonry';
import ProjectOverview from 'components/ProjectOverview';
import ProjectSummary from 'components/ProjectSummary';
import useProjects from 'hooks/useProjects';

const HomeProjects = () => {
  const { loading, error, data } = useProjects({ first: 4 });

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        margin: 2,
      }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading projects
      </Alert>
    )
  }

  return data?.projects && (
    <Box> 
      <ProjectOverview project={data.projects[0]} />
      <Divider sx={{ margin: '32px 0' }} />
      
      <Typography variant="h4">
        Recent projects
      </Typography>

      <Masonry columns={[1, 1, 3]} spacing={2} sx={{ margin: '32px 0 48px' }}>
        {[1, 2, 3].map((index) => (
          <ProjectSummary project={data.projects[index]} />
        ))}
      </Masonry>
    </Box>
  )
}

export default HomeProjects;
