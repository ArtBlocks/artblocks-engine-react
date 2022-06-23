import useProjects from 'hooks/useProjects';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Masonry from '@mui/lab/Masonry';
import { Project } from 'utils/types';
import ProjectSummary from './ProjectSummary';

const ProjectList = () => {
  const { loading, error, data } = useProjects();

  if (loading) {
    return (
      <CircularProgress />
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading projects
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4">
        All Projects
      </Typography>
      <Masonry columns={[1, 1, 2]} spacing={3} sx={{ margin: '32px 0 48px' }}>
        {
          data?.projects && (
            data.projects.map((project: Project) => (
              <ProjectSummary
                key={project.id}
                project={project}
                showDescription
                showMoreLink
              />
            ))
          )
        }
      </Masonry>
    </Box>
  )
}

export default ProjectList;
