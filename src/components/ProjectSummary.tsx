import moment from 'moment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import { Project } from 'utils/types';
import TokenImage from 'components/TokenImage';
import { useWindowSize } from 'hooks/useWindowSize';
import { Link } from '@mui/material';

interface Props {
  project: Project;
  showDescription?: boolean;
  showMoreLink?: boolean;
}

const ProjectSummary = ({
  project,
  showDescription=false,
  showMoreLink=false,
}:Props) => {
  const token = project.tokens[0];
  const theme = useTheme();
  const size = useWindowSize();

  let width = 280;
  if (size && !isNaN(size.width)) {
    width = size.width > theme.breakpoints.values.md
      ? (Math.min(size.width, 1200)- 96)*0.33333
        : size.width > theme.breakpoints.values.sm
          ? size.width - 64
          : size.width - 48
  }

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
            { project.description }
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
