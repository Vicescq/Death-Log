import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate, HashRouter } from "react-router";
import "./index.css";
import Home from "./pages/Home.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage, { ForceError } from "./pages/ErrorPage.tsx";
import Root from "./pages/Root.tsx";
import URLRouter from "./components/URLRouter.tsx";
import { ContextWrapper } from "./contexts/ContextWrapper.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ContextWrapper children={<AppRoutes />} />
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
          <Route path=":gameName" element={<URLRouter />} />
          <Route path=":gameName/:profileName" element={<URLRouter />} />
          <Route path=":gameName/:profileName/:subjectName" element={<URLRouter />} />
          <Route path=":gameName/:profileName/:subjectName/*" element={<ForceError msg={"URL NOT FOUND!"} />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

