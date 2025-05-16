import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate, HashRouter } from "react-router";
import "./index.css";
import Home from "./pages/Home.tsx";
import GameProfiles from "./pages/GameProfiles.tsx";
import { GamesContextWrapper } from "./context.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage.tsx";
import Root from "./pages/Root.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <GamesContextWrapper children={<AppRoutes />} />
    </HashRouter>
  </StrictMode>
);

function AppRoutes() {
  let navigate = useNavigate();
  return (
    <ErrorBoundary FallbackComponent={ErrorPage} onReset={() => navigate("/")}>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path=":gameName" element={<GameProfiles />} />
          <Route path=":gameName/:profileName" element={<ProfilePage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}