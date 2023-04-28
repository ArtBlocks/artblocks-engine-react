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
import ProjectStatusBadge from "./ProjectStatusBadge"

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
        <Link href={`/project/${project.contract.id}/${project.projectId}`} underline="hover">
          <Typography variant="h1" fontSize={36}>
            {project.name}
          </Typography>
        </Link>
        <Typography variant="h6" mb={1}>
          by {project.artistName}
        </Typography>
      </Box>
      <TokenView
        contractAddress={project.contract.id}
        tokenId={token?.tokenId}
        width={width}
        invocation={token?.invocation}
        aspectRatio={project.aspectRatio || parseAspectRatio(project.scriptJSON)}
      />
      <Box>
        <Box sx={{display: "flex", alignItems:"center"}}>

          <ProjectStatusBadge complete={project.complete} paused={project.paused} startTime={project?.minterConfiguration?.startTime} />
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
