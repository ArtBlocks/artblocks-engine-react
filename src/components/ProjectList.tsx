import { useState, useEffect } from 'react';
import useProjects from 'hooks/useProjects';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Masonry from '@mui/lab/Masonry';
import { Project } from 'utils/types';
import { useWindowSize } from 'hooks/useWindowSize';
import useTheme from '@mui/material/styles/useTheme';
import ProjectSummary from './ProjectSummary';
import Loading from './Loading';
import { projectsPerPage } from 'config';
import { Pagination } from '@mui/material';

const ProjectList = () => {
  const size = useWindowSize();
  const theme = useTheme();
  const [highestProjectId, setHighestProjectId] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const skip = currentPage * projectsPerPage;
  const first = projectsPerPage;
  const { loading, error, data } = useProjects({ skip, first });

  useEffect(() => {
    if (data?.projects?.length) {
      const { projectId } = data.projects[data.projects.length - 1];
      if (projectId > highestProjectId) {
        setHighestProjectId(projectId);
      }
    }
  }, [data, data?.projects, highestProjectId]);

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading projects
      </Alert>
    )
  }

  let width = 280;
  const maxColumns = 2;
  if (size && !isNaN(size.width)) {
    width = size.width > theme.breakpoints.values.md
      ? (Math.min(size.width, 1200)- 96)*1/maxColumns
        : size.width > theme.breakpoints.values.sm
          ? size.width - 64
          : size.width - 48
  }

  if (data?.projects?.length === 0) {
    return (
      <Alert severity="info">
        No projects found
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" p="0 1rem">
        All Projects
      </Typography>
      <Masonry columns={[1, 1, 2]} spacing={3} sx={{ margin: '32px 0' }}>
        {
          data?.projects && (
            data.projects.map((project: Project) => (
              <ProjectSummary
                key={project.id}
                project={project}
                width={width}
                showDescription
              />
            ))
          )
        }
      </Masonry>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
        <Pagination
          count={Math.ceil(highestProjectId/projectsPerPage)}
          color="primary"
          page={currentPage + 1}
          onChange={(event, page) => {
            setCurrentPage(page - 1);
          }}
        />
      </Box>
    </Box>
  )
}

export default ProjectList;
