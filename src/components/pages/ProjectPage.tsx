import Page from 'components/Page';
import Alert from '@mui/material/Alert';
import ProjectDetails from 'components/ProjectDetails';
import { useParams } from 'react-router-dom';
import { coreContractAddress } from 'config';

const ProjectPage = () => {
  const { projectId } = useParams();

  return (
    <Page>
      {
        projectId ? (
          <ProjectDetails id={coreContractAddress?.toLowerCase() + '-' + projectId} />
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
