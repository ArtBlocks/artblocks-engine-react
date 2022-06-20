import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import Link from "@mui/material/Link";
import { Project } from "utils/types";
import TokenImage from "./TokenImage";
import ProjectStats from "./ProjectStats";

const ProjectPreview = ({
  id,
  name,
  artistName,
  paused,
  complete,
  tokens,
  activatedAt,
}: Project) => (
  <Paper elevation={1} sx={{
    padding: 2,
    marginBottom: 4,
  }}>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
    }}>
      <Link href={`project/${id}`}>
        <Typography variant="h5" fontWeight="bold">
          { name } 
        </Typography>
      </Link>
      <Typography sx={{
        marginLeft: 1,
        marginRight: 1,
      }}>
        •
      </Typography>
      <Typography variant="h5">
        { artistName }
      </Typography>
    </Box>

    <ProjectStats
      paused={paused}
      complete={complete}
      activatedAt={activatedAt}
    />

    {
      tokens && tokens.length > 0 && (
        <Box sx={{ marginTop: 2}}>
          <Grid container spacing={2}>
            {
              tokens.map(token => (
                <Grid key={token.id} item md={3}>
                  <TokenImage
                    tokenId={token.tokenId}
                    width={240}
                    thumb
                  />
                </Grid>
              ))
            }
          </Grid>
        </Box>
      )
    }
  </Paper>
)

export default ProjectPreview;
