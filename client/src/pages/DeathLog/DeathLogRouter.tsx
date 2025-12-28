import { useParams } from "react-router";
import DeathLog from "./DeathLog";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import DeathCounter from "./DeathCounter";
import ErrorPage from "../ErrorPage";

export type CardMainPageTransitionState = {
	type: "GameToProfiles" | "ProfileToSubjects" | "Terminal";
	parentID: string;
};

export default function DeathLogRouter() {
	let params = useParams();

	const tree = useDeathLogStore((state) => state.tree);

	const gameID = params.gameID;
	const profileID = params.profileID;
	const subjectID = params.subjectID;

	if (tree.size == 0){ // handles ErrorPage sudden flicker
		return <></>
	}

	if (gameID && !profileID && !subjectID && tree.has(gameID)) {
		return <DeathLog parentID={gameID} type="profile" key={gameID} />;
	}

	if (profileID && !subjectID && tree.has(profileID)) {
		return <DeathLog parentID={profileID} type="subject" key={profileID} />;
	}

	if (subjectID && tree.has(subjectID)) {
		return <DeathCounter subjectID={subjectID} />;
	}

	return <ErrorPage error={new Error("URL not found!")} />;
}
