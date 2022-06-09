import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectsPage from 'components/pages/ProjectsPage';
import AppProviders from 'components/AppProviders';

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route index element={<ProjectsPage />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;
