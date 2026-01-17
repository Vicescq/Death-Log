import { useParams } from "react-router";
import DeathLog from "./DeathLog";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import DeathLogCounter from "./DeathLogCounter";
import ErrorPage from "../ErrorPage";
import DeathLogProfileGroup from "./DeathLogProfileGroup";
import { assertIsNonNull } from "../../utils";

export type CardMainPageTransitionState = {
	type: "GameToProfiles" | "ProfileToSubjects" | "Terminal";
	parentID: string;
};

export default function DeathLogRouter() {
	const params = useParams();
	const tree = useDeathLogStore((state) => state.tree);

	const gameID = params.gameID;
	const profileID = params.profileID;
	const subjectIDOrProfileGroupEdit = params.subjectID;

	if (
		gameID &&
		tree.has(gameID) &&
		!profileID &&
		!subjectIDOrProfileGroupEdit
	) {
		const game = tree.get(gameID);
		assertIsNonNull(game);
		return <DeathLog parent={game} key={gameID} />;
	}

	if (profileID && tree.has(profileID) && !subjectIDOrProfileGroupEdit) {
		const profile = tree.get(profileID);
		assertIsNonNull(profile);
		return <DeathLog parent={profile} key={profileID} />;
	}

	if (
		profileID &&
		tree.has(profileID) &&
		subjectIDOrProfileGroupEdit == "profile-group-edit"
	) {
		return <DeathLogProfileGroup />;
	}

	if (subjectIDOrProfileGroupEdit && tree.has(subjectIDOrProfileGroupEdit)) {
		const subject = tree.get(subjectIDOrProfileGroupEdit);
		assertIsNonNull(subject);
		return <DeathLogCounter subject={subject} />;
	}

	return <ErrorPage error={new Error("URL not found!")} />;
}
