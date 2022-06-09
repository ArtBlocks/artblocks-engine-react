import Page from 'components/Page';
import Alert from '@mui/material/Alert';
import ProjectDetails from 'components/ProjectDetails';
import { useParams } from 'react-router-dom';

const ProjectPage = () => {
  const { id } = useParams();

  return (
    <Page>
      {
        id ? (
          <ProjectDetails id={id} />
        ) : (
          <Alert severity="info">
            Project not found
          </Alert>
        )
      }
    </Page>
  )
}

export default ProjectPage;
