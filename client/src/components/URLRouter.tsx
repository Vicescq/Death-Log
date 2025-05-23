import { useParams } from "react-router";
import useURLMapContext from "../hooks/useURLMapContext";
import GameProfiles from "../pages/GameProfiles";
import ProfileSubjects from "../pages/ProfileSubjects";
import SubjectDeaths from "../pages/SubjectDeaths";
import { ForceError } from "../pages/ErrorPage";

export default function URLRouter() {
    let component: React.JSX.Element;

    const params = useParams();
    const [urlMap] = useURLMapContext();
    
    const pathArray = [];
    const paramsArray = [params.gameName, params.profileName, params.subjectName];
    for (const param of paramsArray){
        if (param != undefined){
            pathArray.push(param);
        }
    }
    const path = pathArray.join("/");
    let ids = urlMap.get(path);
    
    switch (ids?.length) {
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