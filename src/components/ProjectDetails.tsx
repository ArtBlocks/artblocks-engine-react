import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useProject from 'hooks/useProject';
import { useWindowSize } from 'hooks/useWindowSize';
import useTheme from '@mui/material/styles/useTheme';
import TokenPreview from './TokenPreview';
import ProjectStats from './ProjectStats';
import Loading from './Loading';
import TokenList from './TokenList';
import PurchaseProject from './PurchaseProject';
import { tokensPerPage } from 'config';
import { parseScriptType, parseAspectRatio } from 'utils/scriptJSON';

interface Props {
  id: string;
}

interface TitleProps {
  children: any;
}

const Title = ({ children }: TitleProps) => (
  <Typography
    fontSize="12px"
    textTransform="uppercase"
    mb={2}
  >
    { children }
  </Typography>
);

const ProjectDetails = ({ id }: Props) => {
  const { loading, error, data } = useProject(id);
  const [currentPage, setCurrentPage] = useState(0);
  const size = useWindowSize();
  const theme = useTheme();

  if (data?.project === null) {
    return <Alert severity="error">Project not found</Alert>
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading project
      </Alert>
    )
  }

  const project = data?.project;
  const token = project?.tokens[0];
  const width = size.width > theme.breakpoints.values.md
    ? (Math.min(size.width, 1200)- 48)*0.666666
      : size.width > theme.breakpoints.values.sm
        ? size.width - 48
        : size.width - 32;

  const {
    name,
    description,
    artistName,
    website,
    license,
    paused,
    complete,
    invocations,
    maxInvocations,
    scriptJSON,
  } = project;
  
  return project && (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 4 }}>
        <Link href="/" underline="hover" sx={{ color: '#666' }}>
          Home
        </Link>
        <Typography>
          { name }
        </Typography>
      </Breadcrumbs>


      <Grid spacing={2} container>
        {
          project.tokens?.length > 0 && (
            <Grid item md={8}>
              <TokenPreview
                id={token.id}
                tokenId={token.tokenId}
                invocation={token.invocation}
                aspectRatio={parseAspectRatio(scriptJSON)}
                width={width}
                showImageLink
                showLiveViewLink
              />
            </Grid>
          )
        }
        
        <Grid item md={4} xs={12} sm={12}>
          <Box sx={{ width: '100%', paddingLeft: [0, 0, 2]}}>
            <ProjectStats
              paused={paused}
              complete={complete}
              startTime={project?.minterConfiguration?.startTime}
            />
            
            <Typography variant="h4" mt={3}>
              { name } 
            </Typography>

            <Typography variant="h6" mb={2}>
              { artistName }
            </Typography>

            <Divider sx={{ display: ['block', 'none', 'none'], marginBottom: 2 }} />

            <Box sx={{ fontWeight: 'bold' }}>
              { invocations } / { maxInvocations } minted
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 3,
            }}>
              <LinearProgress
                sx={{ width: 'calc(100% - 48px)' }}
                value={(invocations/maxInvocations)*100}
                variant="determinate"
              />
              <Box sx={{ fontSize: 12 }}>
                { Math.floor((invocations/maxInvocations)*100) } %
              </Box>
            </Box>

            <PurchaseProject project={project} />

          </Box>
        </Grid>
      </Grid>

      <Grid spacing={2} container mt={4} pb={4}>
        <Grid item md={7} sm={12} xs={12}>
          <Typography variant="h6" mb={2}>
            About { name }
          </Typography>
          <Box paddingRight={[0, 0, 4]}>
            { description }
          </Box>
          
          <Box sx={{ display: 'flex', marginTop: 4 }}>
            <Box mr={6}>
              <Title>
                License
              </Title>
              <Typography>
                { license }
              </Typography>
            </Box>

            <Box>
              <Title>
                Library
              </Title>
              <Typography>
                { parseScriptType(scriptJSON) }
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item md={5} sm={12} xs={12}>
          <Box display="flex" mb={4}>
            
            {
              website && (
                <Button
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none', marginRight: 4 }}
                  onClick={() => window.open(website)}
                >
                  Artist link
                </Button>
              )
            }
          </Box>
            
        </Grid>
      </Grid>

      <Divider />

      <Box px={1}>
        <Box mt={4} mb={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">{ invocations} Item{ Number(invocations) === 1 ? '' : 's' }</Typography>

          <Box>
            Showing { Math.min(invocations, tokensPerPage) }
          </Box>
        </Box>
      
        <TokenList
          projectId={id}
          first={tokensPerPage}
          skip={currentPage*tokensPerPage}
          aspectRatio={parseAspectRatio(scriptJSON)}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Stack mt={6} mb={8} spacing={2}>
            <Pagination count={Math.ceil(invocations/tokensPerPage)} color="primary" onChange={(event, page) => {
              setCurrentPage(page - 1);
            }} />
          </Stack>
        </Box>

      </Box>
    </Box>
  )
}

export default ProjectDetails;
