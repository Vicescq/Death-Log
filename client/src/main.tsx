import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate, HashRouter, useParams } from "react-router";
import "./index.css";
import Home from "./pages/Home.tsx";
import GameProfiles from "./pages/GameProfiles.tsx";
import { ContextWrapper, useGamesContext } from "./context.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage, { ForceError } from "./pages/ErrorPage.tsx";
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
          <Route path=":gameName" element={<URLMapper/>} />
          <Route path=":gameName/:profileName" element={<URLMapper/>} />
          <Route path=":gameName/:profileName/:subjectName" element={<URLMapper/>} />
          <Route path=":gameName/:profileName/:subjectName/*" element={<ForceError msg={"URL NOT FOUND!"}/>} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

function URLMapper() {
  let component;
  const params = useParams();
  const [games] = useGamesContext();
  const paramsArray = [params.gameName, params.profileName, params.subjectName];
  const indices: number[] = [];

  function negativeOneCheckWrapper(returnValue: number){
    if(returnValue != -1){
      return returnValue
    }
    else{
      throw Error("URL Not found!")
    }
  }

  for (let i = 0; i < paramsArray.length; i++) {
    if (paramsArray[i] != undefined) {
      let indexLoc;
      switch (i) {
        case 0:
          indexLoc = games.findIndex((game) => game.getSlug() == paramsArray[i])
          indices.push(negativeOneCheckWrapper(indexLoc));
          break;
        case 1:
          indexLoc = games[indices[0]].items.findIndex((profile) => profile.getSlug() == paramsArray[i])
          indices.push(negativeOneCheckWrapper(indexLoc));
          break;
        case 2:
          indexLoc = games[indices[0]].items[indices[1]].items.findIndex((subject) => subject.getSlug() == paramsArray[i])
          indices.push(negativeOneCheckWrapper(indexLoc));
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