import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Alert,
  FormControl,
  NativeSelect,
  Pagination,
  Grid
} from "@mui/material"
import useTheme from "@mui/material/styles/useTheme"
import { PROJECTS_PER_PAGE } from "config"
import { OrderDirection, Project } from "utils/types"
import ProjectPreview from "components/ProjectPreview"
import Loading from "components/Loading"
import useProjects from "hooks/useProjects"
import useWindowSize from "hooks/useWindowSize"
import useCountProjects from "hooks/useCountProjects"

const Projects = () => {
  const theme = useTheme()
  const windowSize = useWindowSize()
  const [countProjects, setCountProjects] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const skip = currentPage * PROJECTS_PER_PAGE
  const first = PROJECTS_PER_PAGE
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.DESC)
  const { loading, error, data } = useProjects({skip, first, orderDirection})
  const countProjectsResponse = useCountProjects()

  useEffect(() => {
    if (countProjectsResponse.data?.projects?.length) {
      setCountProjects(countProjectsResponse.data?.projects?.length)
    }
  }, [countProjectsResponse.data?.projects?.length])

  let width = 280
  const maxColumns = 2
  if (windowSize && !isNaN(windowSize.width)) {
    width = windowSize.width > theme.breakpoints.values.md
      ? (Math.min(windowSize.width, 1200)- 96)/maxColumns
        : windowSize.width > theme.breakpoints.values.sm
          ? windowSize.width - 64
          : windowSize.width - 48
  }

  return (
    <Box>
      <Box sx={{display:"flex", justifyContent: "space-between", alignItems: "flex-end"}}>
        <Typography></Typography>
        <Box sx={{display: "flex", alignItems: "center", marginRight: "25px"}}>
          <Box>
            {
              !error && !loading && data?.projects?.length > 0 &&
              (
              <FormControl fullWidth sx={{marginBottom: "50px"}}>
                <NativeSelect
                  value={orderDirection}
                  sx={{fontSize: 14}}
                  onChange={(e) => {
                    setCurrentPage(0)
                    setOrderDirection(e.target.value as OrderDirection)
                  }}
                >
                  <option value={OrderDirection.DESC}>Newest</option>
                  <option value={OrderDirection.ASC}>Oldest</option>
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
            <Grid container spacing={3} sx={{margin: "32px 0"}}>
              {
                data?.projects && (
                  data.projects.map((project: Project) => (
                    <Grid item md={6} key={project.id}>
                      <ProjectPreview
                        project={project}
                        width={width}
                        showDescription
                      />
                    </Grid>
                  ))
                )
              }
            </Grid>
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
                count={Math.ceil(countProjects/PROJECTS_PER_PAGE)}
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
