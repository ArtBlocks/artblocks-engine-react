import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from 'components/pages/HomePage';
import ProjectsPage from 'components/pages/ProjectsPage';
import ProjectPage from 'components/pages/ProjectPage';
import TokenPage from 'components/pages/TokenPage';
import AppProviders from 'components/AppProviders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="project/:id" element={<ProjectPage />} />
          <Route path="token/:id" element={<TokenPage />} />
        </Routes>
      </Router>
      <ToastContainer
        autoClose={10000}
        position="bottom-right"
        theme="light"
        newestOnTop
        pauseOnHover
        pauseOnFocusLoss
      />
    </AppProviders>
  );
}

export default App;
