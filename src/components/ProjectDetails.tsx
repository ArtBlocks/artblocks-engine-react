import useTheme from "@mui/material/styles/useTheme"
import { useState } from "react"
import {
  Box,
  Grid,
  Breadcrumbs,
  Divider,
  Typography,
  Button,
  Stack,
  FormControl,
  InputLabel,
  NativeSelect,
  Pagination,
  Alert,
  Link
} from "@mui/material"
import { TOKENS_PER_PAGE } from "config"
import { OrderDirection } from "utils/types"
import { parseScriptType, parseAspectRatio } from "utils/scriptJSON"
import ProjectDate from "components/ProjectDate"
import ProjectExplore from "components/ProjectExplore"
import TokenView from "components/TokenView"
import Tokens from "components/Tokens"
import MintingInterface from "components/MintingInterface"
import Loading from "components/Loading"
import Collapsible from "components/Collapsible"
import useProject from "hooks/useProject"
import useWindowSize from "hooks/useWindowSize"

interface Props {
  id: string
}

const ProjectDetails = ({ id }: Props) => {
  const theme = useTheme()
  const windowSize = useWindowSize()
  const { loading, error, data } = useProject(id)
  const [currentPage, setCurrentPage] = useState(0)
  const [orderDirection, setOrderDirection] = useState(OrderDirection.ASC)
  const project = data?.project
  const token = project?.tokens[0]
  const width = windowSize.width > theme.breakpoints.values.md
    ? (Math.min(windowSize.width, 1200)-48)*0.666666
      : windowSize.width > theme.breakpoints.values.sm
        ? windowSize.width - 48
        : windowSize.width - 32

  if (error) {
    return (
      <Box>
        <Alert severity="error">
          Error loading project
        </Alert>
      </Box>
    )
  }

  if (loading) {
    return <Loading/>
  }

  return project && (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{marginBottom: 4}}>
        <Link href="/projects" underline="hover" sx={{color: "#666"}}>
          Home
        </Link>
        <Typography>
          {project.name}
        </Typography>
      </Breadcrumbs>
      <Grid spacing={2} container>
        {
          token && (
            <Grid item md={8}>
              <TokenView
                tokenId={token.tokenId}
                width={width}
                invocation={token.invocation}
                aspectRatio={parseAspectRatio(project.scriptJSON)}
                live
              />
            </Grid>
          )
        }
        <Grid item md={4} xs={12} sm={12}>
          <Box sx={{width: "100%", paddingLeft: [0, 0, 2]}}>
            <ProjectDate startTime={project?.minterConfiguration?.startTime}/>
            <Typography variant="h1" mt={3}>
              {project.name} 
            </Typography>
            <Typography variant="h6" mb={2}>
              {project.artistName}
            </Typography>
            <Divider sx={{display: ["none", "block", "none"], marginBottom: 2}}/>
            <MintingInterface 
              projectId={project.projectId} 
              artistAddress={project.artistAddress}
              scriptAspectRatio={parseAspectRatio(project.scriptJSON)}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid spacing={2} container mt={4} pb={4}>
        <Grid item md={7} sm={12} xs={12}>
          <Typography variant="h6" mb={2}>
            About {project.name}
          </Typography>
          <ProjectExplore project={project}/>
          <Box paddingRight={[0, 0, 4]}>
            <Collapsible content={project.description}/>
          </Box>
          <Box sx={{display: "flex", marginTop: 4 }}>
            <Box mr={6}>
              <Typography>
                License
              </Typography>
              <Typography>
                {project.license}
              </Typography>
            </Box>
            <Box>
              <Typography>
                Library
              </Typography>
              <Typography>
                {parseScriptType(project.scriptJSON)}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Box display="flex" mb={4}>
            {
              project.website && (
                <Button
                  sx={{textTransform: "none", marginRight: 4}}
                  onClick={() => window.open(project.website)}
                >
                  Artist link
                </Button>
              )
            }
          </Box>
        </Grid>
      </Grid>
      <Divider/>
      <Box px={1}>
        <Box mt={4} mb={4} sx={{display: "flex", justifyContent: "space-between"}}>
          <Typography variant="h4">{project.invocations} Item{Number(project.invocations) === 1 ? "" : "s"}</Typography>
          <Box sx={{display: "flex", alignItems: "center"}}>
            <Box>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  <Typography fontWeight={600}>Sort</Typography>
                </InputLabel>
                <NativeSelect
                  value={orderDirection}
                  sx={{fontSize: 14}}
                  onChange={(e) => {
                    setOrderDirection(e.target.value as OrderDirection)
                  }}
                >
                  <option value={OrderDirection.DESC}>Latest</option>
                  <option value={OrderDirection.ASC}>Earliest</option>
                </NativeSelect>
              </FormControl>
            </Box>
          </Box>
        </Box>
        <Tokens
          projectId={id}
          first={TOKENS_PER_PAGE}
          skip={currentPage*TOKENS_PER_PAGE}
          orderDirection={orderDirection}
          aspectRatio={parseAspectRatio(project.scriptJSON)}
        />
        <Box sx={{display: "flex", justifyContent: "center"}}>
          <Stack mt={6} mb={8} spacing={2}>
            <Pagination
              count={Math.ceil(project.invocations/TOKENS_PER_PAGE)}
              color="primary"
              page={currentPage + 1}
              onChange={(event, page) => {
                setCurrentPage(page - 1)
              }}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default ProjectDetails