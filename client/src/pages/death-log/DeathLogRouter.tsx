import { useParams, useSearchParams } from "react-router";
import DeathLog from "./DeathLog";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import DeathLogCounter from "./counter/DeathLogCounter";
import ErrorPage from "../ErrorPage";
import { assertIsNonNull, assertIsSubject } from "../../utils";
import { CONSTANTS } from "../../../shared/constants";
import DeathLogCardEditor from "./card-editor/DeathLogCardEditor";

export type CardMainPageTransitionState = {
	type: "GameToProfiles" | "ProfileToSubjects" | "Terminal";
	parentID: string;
};

export default function DeathLogRouter() {
	const params = useParams();
	const [searchParams] = useSearchParams();
	const tree = useDeathLogStore((state) => state.tree);

	const gameID = params.gameID;
	const profileID = params.profileID;
	const subjectID = params.subjectID;

	const editParam = searchParams.get("edit");
	const isEditing = Boolean(editParam && editParam == "true");

	if (
		subjectID &&
		tree.has(subjectID) &&
		profileID &&
		tree.has(profileID) &&
		gameID &&
		tree.has(gameID)
	) {
		const subject = tree.get(subjectID);
		assertIsNonNull(subject);
		assertIsSubject(subject);

		if (isEditing) {
			return <DeathLogCardEditor node={subject} />;
		}

		return <DeathLogCounter subject={subject} />;
	} else if (
		profileID &&
		tree.has(profileID) &&
		gameID &&
		tree.has(gameID) &&
		subjectID == undefined
	) {
		const profile = tree.get(profileID);
		assertIsNonNull(profile);

		if (isEditing) {
			return <DeathLogCardEditor node={profile} />;
		}

		return <DeathLog parent={profile} key={profileID} />;
	} else if (
		gameID &&
		tree.has(gameID) &&
		profileID == undefined &&
		subjectID == undefined
	) {
		const game = tree.get(gameID);
		assertIsNonNull(game);

		if (isEditing) {
			return <DeathLogCardEditor node={game} />;
		}

		return <DeathLog parent={game} key={gameID} />;
	}

	return <ErrorPage error={new Error(CONSTANTS.ERROR.URL)} />;
}
