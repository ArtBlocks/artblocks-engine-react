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

  const activatedDate = moment.unix(parseInt(project.activatedAt.toString()));

  return (
    <Box sx={{ paddingBottom: 8 }}>
      <TokenImage
        tokenId={token.tokenId}
        aspectRatio={scriptJSON?.aspectRatio}
        width={width}
        thumb
      />
      <Typography sx={{ marginTop: 3 }}>
        Launched { activatedDate.format('MMMM DD, YYYY') }
      </Typography>
      <Typography variant="h4" sx={{ marginTop: 1 }}>
        { project.name }
      </Typography>
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
