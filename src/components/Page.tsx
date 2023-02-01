import { 
  Container, 
  Box 
} from "@mui/material"

import Header from "components/Header"

interface Props {
  children: React.ReactNode
}

const Page = ({ children }: Props) => {
  return (
    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
      <Header/>
      <main>
        <Container sx={{paddingTop: 1}}>
          {children}
        </Container>
      </main>
    </Box>
  )
}

export default Page
