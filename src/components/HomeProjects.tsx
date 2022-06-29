import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Masonry from '@mui/lab/Masonry';
import ProjectOverview from 'components/ProjectOverview';
import ProjectSummary from 'components/ProjectSummary';
import useProjects from 'hooks/useProjects';
import { useWindowSize } from 'hooks/useWindowSize';
import useTheme from '@mui/material/styles/useTheme';
import Loading from './Loading';

const HomeProjects = () => {
  const { loading, error, data } = useProjects({ first: 7 });
  const size = useWindowSize();
  const theme = useTheme();

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
  const maxColumns = 3;
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

  return data?.projects && (
    <Box sx={{ paddingTop: 2 }}> 
      <ProjectOverview project={data.projects[0]} />
      <Divider sx={{ margin: '32px 0' }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', align: 'center' }}>
        <Typography variant="h4">
          Recent projects
        </Typography>

        <Button href="projects" endIcon={<ArrowForwardIcon />}>
          See all
        </Button>
      </Box>

      <Masonry columns={[1, 1, 3]} spacing={2} sx={{ margin: '32px 0 48px' }}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <ProjectSummary key={index} project={data.projects[index]} width={width} />
        ))}
      </Masonry>
    </Box>
  )
}

export default HomeProjects;
