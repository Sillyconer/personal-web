import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { CrtOverlay } from './components/effects/CrtOverlay';
import { InteractionFx } from './components/effects/InteractionFx';
import { PixelBoids } from './components/effects/PixelBoids';
import { AppShell } from './components/layout/AppShell';
import { ArcadePage } from './pages/ArcadePage';
import { ChronoPlaygroundPage } from './pages/ChronoPlaygroundPage';
import { ContactPage } from './pages/ContactPage';
import { CVPage } from './pages/CVPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { PokemonPlaygroundPage } from './pages/PokemonPlaygroundPage';
import { PokemonSpriteEditorPage } from './pages/PokemonSpriteEditorPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { StudioPage } from './pages/StudioPage';
import { WorkPage } from './pages/WorkPage';
import { ZeldaPlaygroundPage } from './pages/ZeldaPlaygroundPage';

function App() {
  return (
    <BrowserRouter>
      <PixelBoids />
      <CrtOverlay />
      <InteractionFx />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="cv" element={<CVPage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="playground" element={<PlaygroundPage />} />
          <Route path="playground/pokemon" element={<PokemonPlaygroundPage />} />
          <Route path="playground/pokemon/editor" element={<PokemonSpriteEditorPage />} />
          <Route path="playground/zelda" element={<ZeldaPlaygroundPage />} />
          <Route path="playground/chrono" element={<ChronoPlaygroundPage />} />
          <Route path="playground/minecraft" element={<ArcadePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="editor" element={<PokemonSpriteEditorPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="projects" element={<Navigate to="/work" replace />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="work/:slug" element={<ProjectDetailPage />} />
          <Route path="story" element={<Navigate to="/cv" replace />} />
          <Route path="arcade" element={<Navigate to="/playground/minecraft" replace />} />
          <Route path="about" element={<Navigate to="/cv" replace />} />
          <Route path="admin" element={<Navigate to="/studio" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
