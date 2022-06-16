import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import { Project } from 'utils/types';
import TokenImage from 'components/TokenImage';
import { useWindowSize } from 'hooks/useWindowSize';

interface Props {
  project: Project;
}

const ProjectSummary = ({ project }:Props) => {
  const token = project.tokens[0];
  const theme = useTheme();
  const size = useWindowSize();

  const width = size.width > theme.breakpoints.values.md
    ? (Math.min(size.width, 1200)- 96)*0.33333
      : size.width > theme.breakpoints.values.sm
        ? size.width - 64
        : size.width - 48

  let scriptJSON;
  try {
    scriptJSON = JSON.parse(project.scriptJSON);
  } catch (e) {
    console.log('Error parsing script JSON');
  }

  return (
    <Box>
      <TokenImage
        tokenId={token.tokenId}
        aspectRatio={scriptJSON?.aspectRatio}
        width={width}
        thumb
      />
      <Typography variant="h4" sx={{ marginTop: 2 }}>
        { project.name }
      </Typography>
      <Typography variant="h6">
        { project.artistName }
      </Typography>
    </Box>
  )
}

export default ProjectSummary;
