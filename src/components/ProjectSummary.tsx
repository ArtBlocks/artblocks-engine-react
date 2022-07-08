import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Project } from 'utils/types';
import TokenImage from 'components/TokenImage';
import Link from '@mui/material/Link';
import { parseAspectRatio } from 'utils/scriptJSON';
import Collapsible from './Collapsible';
import ProjectStats from './ProjectStats';

interface Props {
  project: Project;
  width?: number;
  showDescription?: boolean;
}

const ProjectSummary = ({
  project,
  width=280,
  showDescription=false,
}:Props) => {
  if (!project) {
    return null;
  }

  const token = project?.tokens[0];

  return (
    <Box sx={{ paddingBottom: 8 }}>
      <Link href={`/project/${project.projectId}`}>
        <TokenImage
          tokenId={token.tokenId}
          aspectRatio={parseAspectRatio(project.scriptJSON)}
          width={width}
          invocation={token.invocation}
        />
      </Link>
      <Box mt={3}>
        <ProjectStats
          complete={project.complete}
          paused={project.paused}
          startTime={project.minterConfiguration?.startTime}
        />
      </Box>
      <Box mt={2}>
        <Link href={`/project/${project.projectId}`} underline="hover" sx={{ marginTop: 1, fontSize: 32 }}>
          { project.name }
        </Link>
        <Typography variant="h6" mb={2}>
          { project.artistName }
        </Typography>
        {
          showDescription && (
            <Collapsible content={project.description} />
          )
        }
      </Box>
    </Box>
  )
}

export default ProjectSummary;
