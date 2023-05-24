import { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import RefreshIcon from "@mui/icons-material/Refresh"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Alert from "@mui/material/Alert"
import ButtonBase from "@mui/material/ButtonBase"
import CloseIcon from "@mui/icons-material/Close"
import Loading from "components/Loading"
import { Project } from "utils/types"
import { parseAspectRatio } from "utils/scriptJSON"
import useGeneratorPreview from "hooks/useGeneratorPreview"

interface Props {
  project: Project
}

const ProjectExplore = ({project}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    content,
    loading,
    error,
    refreshPreview
  } = useGeneratorPreview(project)

  const handleClose = () => {
    setDialogOpen(false)
  }

  const aspectRatio = project?.aspectRatio || parseAspectRatio(project?.scriptJSON) || 1
  const width = 280
  const height = width / aspectRatio

  return (
    <Box mb={3}>
      <Button
        variant="contained"
        endIcon={<RestartAltIcon/>}
        onClick={() => setDialogOpen(true)}
      >
        Explore possibilities
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            m: 0,
            position: "fixed",
            top: 140
          }
        }}
        fullWidth
      >
        <ButtonBase
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px"
          }}
        >
          <CloseIcon color="primary"/>
        </ButtonBase>
        <DialogTitle>
          Exploring {project.name}
        </DialogTitle>
        <DialogContent>
          <Box
            margin="24px auto"
            width="100%"
            height={height}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {
              loading ? (
                <Loading />
              ) : error ? (
                <Alert severity="error">
                  Error loading preview
                </Alert>
              ) : content ? (
                <iframe
                  title={project.name+"preview"}
                  srcDoc={content}
                  width={`${width}px`}
                  height={`${height}px`}
                  frameBorder="0"
                />
              ) : null
            }
          </Box>
          <Box my={2} width="100%" textAlign="center">
            Refresh to see more possible results
          </Box>
          <Box textAlign="center">
            <Button
              variant="contained"
              onClick={refreshPreview}
              endIcon={<RefreshIcon/>}
            >
              Refresh
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ProjectExplore
