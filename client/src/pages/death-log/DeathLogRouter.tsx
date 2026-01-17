import { useParams } from "react-router";
import DeathLog from "./DeathLog";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import DeathLogCounter from "./DeathLogCounter";
import ErrorPage from "../ErrorPage";
import DeathLogProfileGroup from "./DeathLogProfileGroup";

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

	const game = gameID ? tree.get(gameID) : undefined;
	const profile = profileID ? tree.get(profileID) : undefined;
	const subject = subjectID ? tree.get(subjectID) : undefined;

	if (game && !profile && !subject) {
		return <DeathLog parent={game} key={gameID} />;
	}

	if (profile && !subject) {
		return <DeathLog parent={profile} key={profileID} />;
	}

	if (subject) {
		return <DeathLogCounter subject={subject} />;
	}

	return <ErrorPage error={new Error("URL not found!")} />;
}
