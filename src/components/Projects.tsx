import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  NativeSelect,
  Pagination
} from "@mui/material"
import Masonry from "@mui/lab/Masonry"
import useTheme from "@mui/material/styles/useTheme"
import { PROJECTS_PER_PAGE } from "config"
import { OrderDirection, Project } from "utils/types"
import ProjectPreview from "components/ProjectPreview"
import Loading from "components/Loading"
import useProjects from "hooks/useProjects"
import useWindowSize from "hooks/useWindowSize"

const Projects = () => {
  const theme = useTheme()
  const windowSize = useWindowSize()
  const [highestProjectId, setHighestProjectId] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const skip = currentPage * PROJECTS_PER_PAGE
  const first = PROJECTS_PER_PAGE
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.DESC)
  const { loading, error, data } = useProjects({skip, first, orderDirection})

  useEffect(() => {
    if (data?.projects?.length) {
      const projectIds = data.projects.map((project: Project) => Number(project.projectId))
      const maxProjectId = Math.max(...projectIds)
      if (maxProjectId > highestProjectId) {
        setHighestProjectId(maxProjectId)
      }
    }
  }, [data, data?.projects, highestProjectId])

  let width = 280
  const maxColumns = 2
  if (windowSize && !isNaN(windowSize.width)) {
    width = windowSize.width > theme.breakpoints.values.md
      ? (Math.min(windowSize.width, 1200)- 96)*1/maxColumns
        : windowSize.width > theme.breakpoints.values.sm
          ? windowSize.width - 64
          : windowSize.width - 48
  }

  return (
    <Box>
      <Box sx={{display:"flex", justifyContent: "space-between", alignItems: "flex-end"}}>
        <Typography></Typography>
        <Box sx={{display: "flex", alignItems: "center", marginTop:"25px", marginRight: "25px"}}>
          <Box>
            {
              !error && !loading && data?.projects?.length > 0 &&
              (
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  <Typography fontWeight={600}>Sort</Typography>
                </InputLabel>
                <NativeSelect
                  value={orderDirection}
                  sx={{fontSize: 14}}
                  onChange={(e) => {
                    setCurrentPage(0)
                    setOrderDirection(e.target.value as OrderDirection)
                  }}
                >
                  <option value={OrderDirection.DESC}>Latest</option>
                  <option value={OrderDirection.ASC}>Earliest</option>
                </NativeSelect>
              </FormControl>
              )
            }
          </Box>
        </Box>
      </Box>
      <Box sx={{marginTop: "-100px"}}>
        {
          loading ? 
          (
            <Box marginTop={10}>
              <Loading/>
            </Box>
          ) : 
          error ? 
          (
            <Box marginTop={10}>
              <Alert severity="error">
                Error loading projects
              </Alert>
            </Box>
          ) : 
          data?.projects?.length > 0 ? 
          (
            <Masonry columns={[1, 1, 2]} spacing={3} sx={{margin: "32px 0"}}>
              {
              data?.projects && (
                data.projects.map((project: Project) => (
                  <ProjectPreview
                    key={project.id}
                    project={project}
                    width={width}
                    showDescription
                  />
                ))
              )
            }
            </Masonry>
          ) : 
          data?.projects?.length === 0 ? (
            <Box marginTop={10}>
              <Alert severity="info">
                No projects found
              </Alert>
            </Box>
          ) : 
          null
        }
        {
          !error && !loading && data?.projects?.length > 0 && (
            <Box sx={{display: "flex", justifyContent: "center", marginBottom: "50px"}}>
              <Pagination
                count={Math.ceil(highestProjectId/PROJECTS_PER_PAGE)}
                color="primary"
                page={currentPage + 1}
                onChange={(event, page) => {
                  window.scrollTo(0, 0)
                  setCurrentPage(page - 1)
                }}/>
            </Box>
          )
        }
      </Box>
    </Box>
  )
}

export default Projects