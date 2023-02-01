import { 
  Box, 
  Typography 
} from "@mui/material"
import Page from "components/Page"

const LandingPage = () => {
  return (
    <Page>
      <Box marginTop={10}>
        <Typography variant="h1" fontSize={64}>ArtBlocks Engine</Typography>
        <Typography variant="h6" fontSize={48} fontStyle="italic">Template Project</Typography>
      </Box>
    </Page>
  )
}

export default LandingPage
 