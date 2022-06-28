import moment from 'moment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Project } from 'utils/types';
import TokenImage from 'components/TokenImage';
import { Link } from '@mui/material';
import truncate from 'utils/truncate';

interface Props {
  project: Project;
  width?: number;
  showDescription?: boolean;
  showMoreLink?: boolean;
}

const ProjectSummary = ({
  project,
  width=280,
  showDescription=false,
  showMoreLink=false,
}:Props) => {
  const token = project.tokens[0];


  let scriptJSON;
  try {
    scriptJSON = JSON.parse(project.scriptJSON);
  } catch (e) {
    console.log('Error parsing script JSON');
  }

  const startDate = project.minterConfiguration?.startTime
    ? moment.unix(parseInt(project.minterConfiguration.startTime.toString()))
    : null;

  return (
    <Box sx={{ paddingBottom: 8 }}>
      <TokenImage
        tokenId={token.tokenId}
        aspectRatio={scriptJSON?.aspectRatio}
        width={width}
        thumb
      />
      {
        startDate && (
          <Typography sx={{ marginTop: 3 }}>
            { startDate.isBefore() ? 'Launched' : '' } { startDate.format('MMMM DD, YYYY') }
          </Typography>
        )
      }
      <Link href={`/project/${project.id}`} underline="hover" sx={{ marginTop: 1, fontSize: 32 }}>
        { project.name }
      </Link>
      <Typography variant="h6">
        { project.artistName }
      </Typography>
      {
        showDescription && (
          <p>
            { truncate(project.description, 100) }
          </p>
        )
      }
      {
        showMoreLink && (
          <Link href={`/project/${project.id}`}>
            More
          </Link>
        )
      }
    </Box>
  )
}

export default ProjectSummary;
