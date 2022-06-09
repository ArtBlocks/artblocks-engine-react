import useProjects from 'hooks/useProjects';
import ProjectPreview from 'components/ProjectPreview';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Project } from 'utils/types';

const ProjectList = () => {
  const { loading, error, data } = useProjects();

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

  return (
    <Box>      
      {
        data?.projects && (
          data.projects.map((project: Project) => (
            <ProjectPreview key={project.id} {...project} />
          ))
        )
      }
    </Box>
  )
}

export default ProjectList;
