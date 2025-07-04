import { useParams } from "react-router";
import GameProfiles from "../pages/GameProfiles/GameProfiles";
import { ForceError } from "../pages/ErrorPage";
import useURLMapContext from "../contexts/useURLMapContext";
import ProfileSubjects from "../pages/ProfileSubjects/ProfileSubjects";

export default function URLRouter() {
	let component: React.JSX.Element;

	const params = useParams();
	const [urlMap] = useURLMapContext();

	const pathArray = [];
	const paramsArray = [
		params.gameName,
		params.profileName,
		params.subjectName,
	];
	for (const param of paramsArray) {
		if (param != undefined) {
			pathArray.push(param);
		}
	}
	const path = pathArray.join("/");
	let id = urlMap.get(path);

	switch (pathArray.length) {
		case 1:
			component = <GameProfiles gameID={id!} />;
			break;
		case 2:
			component = <ProfileSubjects profileID={id!} />;
			break;
		default:
			component = <ForceError msg={"URL NOT FOUND!"} />;
	}
	return component;
}
