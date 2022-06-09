import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Project } from "utils/types";

const ProjectPreview = ({
  id,
  name,
  artistName,
  invocations,
  maxInvocations,
}: Project) => {
  return (
    <Paper elevation={1} sx={{
      padding: 2,
    }}>
      <Box sx={{
        justifyContent: 'space-between'
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
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box>
          { invocations?.toString() } of { maxInvocations?.toString() }
        </Box>
      </Box>
    </Paper>
  )
}

export default ProjectPreview;
