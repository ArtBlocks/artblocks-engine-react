import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Alert,
  FormControl,
  NativeSelect,
  Pagination,
  Grid,
  Link
} from "@mui/material"
import { PROJECTS_PER_PAGE } from "config"
import { OrderDirection, Project } from "utils/types"
import Loading from "components/Loading"
import OwnedTokens from "components/OwnedTokens"
import useOwnedProjects from "hooks/useOwnedProjects"
import useCountOwnedProjects from "hooks/useCountOwnedProjects"
import { parseAspectRatio } from "utils/scriptJSON"

interface Props {
  walletAddress: string
}

const OwnedProjects = ({ walletAddress }: Props) => {
  const [countOwnedProjects, setCountOwnedProjects] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const skip = currentPage * PROJECTS_PER_PAGE
  const first = PROJECTS_PER_PAGE
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.DESC)
  const { loading, error, data } = useOwnedProjects(walletAddress, {skip, first, orderDirection})
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const countOwnedProjectsResponse = useCountOwnedProjects(walletAddress)

  useEffect(() => {
    setFilteredProjects(data?.projects?.filter((project: { tokens: string | any[] }) => {
      return project.tokens.length > 0
    }))
    setCountOwnedProjects(countOwnedProjectsResponse.data?.projects?.filter((project: { tokens: string | any[] }) => {
      return project.tokens.length > 0
    }).length)
  }, [data, countOwnedProjectsResponse])

  return (
    <Box>
      <Box sx={{display:"flex", justifyContent: "space-between", alignItems: "flex-end"}}>
        <Typography></Typography>
        <Box sx={{display: "flex", alignItems: "center", marginRight: "25px"}}>
          <Box>
            {
              !error && !loading && filteredProjects?.length > 0 &&
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
          filteredProjects?.length > 0 ?
          (
            <Grid container spacing={3} sx={{margin: "32px 0"}}>
              {
                filteredProjects && (
                  filteredProjects.map((project: Project) => (
                    <Grid item md={12} key={project.id}>
                      <Link href={`/project/${project.contract.id}/${project.projectId}`} underline="hover">
                        <Typography variant="h1" fontSize={36}>{project.name} by {project.artistName}</Typography>
                      </Link>
                      <OwnedTokens contractAddress={project.contract.id} projectId={project.id} walletAddress={walletAddress} aspectRatio={project.aspectRatio || parseAspectRatio(project.scriptJSON)}/>
                    </Grid>
                  ))
                )
              }
            </Grid>
          ) :
          filteredProjects?.length === 0 ? (
            <Box marginTop={10}>
              <Alert severity="info">
                No projects found
              </Alert>
            </Box>
          ) :
          null
        }
        {
          !error && !loading && filteredProjects?.length > 0 && (
            <Box sx={{display: "flex", justifyContent: "center", marginBottom: "50px"}}>
              <Pagination
                count={Math.ceil(countOwnedProjects/PROJECTS_PER_PAGE)}
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

export default OwnedProjects
