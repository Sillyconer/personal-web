import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { InteractionFx } from './components/effects/InteractionFx';
import { AppShell } from './components/layout/AppShell';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { StudioPage } from './pages/StudioPage';
import { WorkPage } from './pages/WorkPage';

function App() {
  return (
    <BrowserRouter>
      <InteractionFx />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="projects" element={<Navigate to="/work" replace />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="work/:slug" element={<ProjectDetailPage />} />
          <Route path="cv" element={<Navigate to="/about" replace />} />
          <Route path="admin" element={<Navigate to="/studio" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
