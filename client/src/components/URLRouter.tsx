export default function URLRouter() {
  let component: React.JSX.Element;
  // const params = useParams();
  // const [games] = useGamesContext();
  // const [urlMap, setURLMap] = useURLMapContext()
  // const paramsArray = [params.gameName, params.profileName, params.subjectName];
  // const ids: string[] = [];

  // let definedCounter = -1; // in terms of indices
  // for (let i = 0; i < paramsArray.length; i++) {
  //   if (paramsArray[i] != undefined) {
  //     definedCounter++;
  //   }
  // }
  
  // let key: string;
  // let urlMapStateValue: URLMapStateValueType
  // switch (definedCounter) {

  //   case 0:
  //     key = params.gameName!;
  //     urlMapStateValue = urlMap.get(key)!
  //     ids.push(urlMapStateValue.gameID);
  //     break;
  //   case 1:
  //     key = params.gameName! + "/" + params.profileName!;
  //     urlMapStateValue = urlMap.get(key)!
  //     ids.push(urlMapStateValue.gameID!);
  //     ids.push(urlMapStateValue.profileID!);
  //     break;
  //   case 2:
  //     key = params.gameName! + "/" + params.profileName! + "/" + params.subjectName!;
  //     urlMapStateValue = urlMap.get(key)!
  //     ids.push(urlMapStateValue.gameID!);
  //     ids.push(urlMapStateValue.profileID!);
  //     ids.push(urlMapStateValue.subjectID!);
  // }

  // switch (ids.length) {
  //   case 1:
  //     component = (<GameProfiles gameID={ids[0]} />)
  //     break;
  //   case 2:
  //     component = (<ProfileSubjects gameID={ids[0]} profileID={ids[1]} />)
  //     break;
  //   case 3:
  //     component = (<SubjectDeaths gameID={ids[0]} profileID={ids[1]} subjectID={ids[2]} />)
  //     break;
  //   default:
  //     component = (<ForceError msg={"URL NOT FOUND!"} />)
  // }
  return (
    component
  )
}