import { useParams } from "react-router";
import Profiles from "../pages/Profiles/Profiles";
import { ForceError } from "../pages/ErrorPage";
import useURLMapContext from "../contexts/useURLMapContext";
import Subjects from "../pages/Subjects/Subjects";

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
			component = <Profiles gameID={id!} />;
			break;
		case 2:
			component = <Subjects profileID={id!} />;
			break;
		default:
			component = <ForceError msg={"URL NOT FOUND!"} />;
	}
	return component;
}
