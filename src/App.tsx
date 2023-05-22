import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LandingPage from "pages/LandingPage"
import ProjectsPage from "pages/ProjectsPage"
import ProjectPage from "pages/ProjectPage"
import TokenPage from "pages/TokenPage"
import UserPage from "pages/UserPage"
import Providers from "components/Providers"

function App() {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route index element={<LandingPage/>}/>
          <Route path="projects" element={<ProjectsPage/>}/>
          <Route path="project/:contractAddress/:projectId" element={<ProjectPage/>}/>
          <Route path="token/:contractAddress/:id" element={<TokenPage/>}/>
          <Route path="user/:walletAddress" element={<UserPage/>}/>
        </Routes>
      </Router>
      <ToastContainer
        autoClose={10000}
        position="bottom-right"
        theme="dark"
        newestOnTop
        pauseOnHover
        pauseOnFocusLoss
      />
    </Providers>
  )
}

export default App
