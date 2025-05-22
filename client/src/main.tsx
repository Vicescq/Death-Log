import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate, HashRouter, useParams } from "react-router";
import "./index.css";
import Home from "./pages/Home.tsx";
import GameProfiles from "./pages/GameProfiles.tsx";
import { ContextWrapper, type URLMapStateValueType } from "./context.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage, { ForceError } from "./pages/ErrorPage.tsx";
import Root from "./pages/Root.tsx";
import ProfileSubjects from "./pages/ProfileSubjects.tsx";
import SubjectDeaths from "./pages/SubjectDeaths.tsx";
import useGamesContext from "./hooks/useGamesContext.tsx";
import useURLMapContext from "./hooks/useURLMapContext.tsx";
import useConsoleLogOnStateChange from "./hooks/useConsoleLogOnStateChange.tsx";


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
          <Route path=":gameName" element={<URLToComponentMapper />} />
          <Route path=":gameName/:profileName" element={<URLToComponentMapper />} />
          <Route path=":gameName/:profileName/:subjectName" element={<URLToComponentMapper />} />
          <Route path=":gameName/:profileName/:subjectName/*" element={<ForceError msg={"URL NOT FOUND!"} />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default function URLToComponentMapper() {
  let component: React.JSX.Element;
  const params = useParams();
  const [games] = useGamesContext();
  const [urlMap, setURLMap] = useURLMapContext()
  const paramsArray = [params.gameName, params.profileName, params.subjectName];
  const ids: string[] = [];

  let definedCounter = -1; // in terms of indices
  for (let i = 0; i < paramsArray.length; i++) {
    if (paramsArray[i] != undefined) {
      definedCounter++;
    }
  }
  
  let key: string;
  let urlMapStateValue: URLMapStateValueType
  switch (definedCounter) {

    case 0:
      key = params.gameName!;
      urlMapStateValue = urlMap.get(key)!
      ids.push(urlMapStateValue.gameID);
      break;
    case 1:
      key = params.gameName! + "/" + params.profileName!;
      urlMapStateValue = urlMap.get(key)!
      ids.push(urlMapStateValue.gameID!);
      ids.push(urlMapStateValue.profileID!);
      break;
    case 2:
      key = params.gameName! + "/" + params.profileName! + "/" + params.subjectName!;
      urlMapStateValue = urlMap.get(key)!
      ids.push(urlMapStateValue.gameID!);
      ids.push(urlMapStateValue.profileID!);
      ids.push(urlMapStateValue.subjectID!);
  }

  switch (ids.length) {
    case 1:
      component = (<GameProfiles gameID={ids[0]} />)
      break;
    case 2:
      component = (<ProfileSubjects gameID={ids[0]} profileID={ids[1]} />)
      break;
    case 3:
      component = (<SubjectDeaths gameID={ids[0]} profileID={ids[1]} subjectID={ids[2]} />)
      break;
    default:
      component = (<ForceError msg={"URL NOT FOUND!"} />)
  }
  return (
    component
  )
}