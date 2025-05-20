import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate, HashRouter, useParams } from "react-router";
import "./index.css";
import Home from "./pages/Home.tsx";
import GameProfiles from "./pages/GameProfiles.tsx";
import { ContextWrapper, useGamesContext } from "./context.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage.tsx";
import Root from "./pages/Root.tsx";
import ProfileSubjects from "./pages/ProfileSubjects.tsx";
import SubjectDeaths from "./pages/SubjectDeaths.tsx";


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
          <Route path=":gameName" element={<URLMapper />} />
          <Route path=":gameName/:profileName" element={<URLMapper />} />
          <Route path=":gameName/:profileName/:subjectName" element={<URLMapper />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

function URLMapper() {
  let component;
  let params = useParams();
  const [games, _] = useGamesContext();
  const paramsArray = [params.gameName, params.profileName, params.subjectName];
  const indices: number[] = [];

  for (let i = 0; i < paramsArray.length; i++) {
    if (paramsArray[i] != undefined) {
      switch (i) {
        case 0:
          indices.push(games.findIndex((game) => game.getSlug() == paramsArray[i] ? true : false));
          break;
        case 1:
          indices.push(games[indices[0]].items.findIndex((profile) => profile.getSlug() == paramsArray[i] ? true : false));
          break;
        case 2:
          indices.push(games[indices[0]].items[indices[1]].items.findIndex((subject) => subject.getSlug() == paramsArray[i] ? true : false));
          break;
      }
    }

    switch (indices.length) {
      case 1:
        component = (<GameProfiles gi={indices[0]} />)
        break;
      case 2:
        component = (<ProfileSubjects gi={indices[0]} pi={indices[1]} />)
        break;
      case 3:
        component = (<SubjectDeaths gi={indices[0]} pi={indices[1]} si={indices[2]} />)
        break;
    }
  }
  return (
    component
  )
}