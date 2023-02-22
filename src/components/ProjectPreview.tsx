import {
  Box,
  Typography,
  Link
} from "@mui/material"
import { Project } from "utils/types"
import { parseAspectRatio } from "utils/scriptJSON"
import Collapsible from "components/Collapsible"
import ProjectDate from "components/ProjectDate"
import TokenView from "components/TokenView"

interface Props {
  project: Project
  width?: number
  showDescription?: boolean
}

const ProjectPreview = ({project, width=280, showDescription=false}: Props) => {
  if (!project) {
    return null
  }

  const token = project?.tokens[0]
  return (
    <Box>
      <Box>
        <Link href={`/project/${project.projectId}`} underline="hover">
          <Typography variant="h1" fontSize={36}>
            {project.name}
          </Typography>
        </Link>
        <Typography variant="h6" mb={1}>
          by {project.artistName}
        </Typography>
      </Box>
      <TokenView
        tokenId={token?.tokenId}
        width={width}
        invocation={token?.invocation}
        aspectRatio={parseAspectRatio(project.scriptJSON)}
      />
      <Box>
        <Box>
          <ProjectDate
            startTime={project.minterConfiguration?.startTime}
          />
        </Box>
        { 
          showDescription && (
            <Box marginTop={2}>
              <Collapsible content={project.description}/>
            </Box>
          )
        }
      </Box>
    </Box>
  )
}

export default ProjectPreview