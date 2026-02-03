import { useParams } from "react-router";
import { CONSTANTS } from "../../../shared/constants";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../utils";
import ErrorPage from "../ErrorPage";
import DeathLogCardEditor from "./card-editor/DeathLogCardEditor";
import DeathLogCounter from "./counter/DeathLogCounter";
import DeathLog from "./DeathLog";

export default function DeathLogRouter({ isEditing }: { isEditing: boolean }) {
	const params = useParams();
	const tree = useDeathLogStore((state) => state.tree);

	const gameID = params.gameID;
	const profileID = params.profileID == "edit" ? undefined : params.profileID;
	const subjectID = params.subjectID == "edit" ? undefined : params.subjectID;

	function isValidNodeID(id: string | undefined) {
		return id && tree.has(id) && isUniqueID();
	}

	function isUniqueID() {
		// handles edge case, where user types in same id as last segment
		return (
			new Set(Object.values(params)).size == Object.keys(params).length
		);
	}

	if (
		isValidNodeID(subjectID) &&
		isValidNodeID(profileID) &&
		isValidNodeID(gameID)
	) {
		assertIsNonNull(subjectID);
		const subject = tree.get(subjectID);
		assertIsNonNull(subject);
		assertIsSubject(subject);

		if (isEditing) {
			return <DeathLogCardEditor node={subject} />;
		}

		return <DeathLogCounter subject={subject} />;
	} else if (
		subjectID == undefined &&
		isValidNodeID(profileID) &&
		isValidNodeID(gameID)
	) {
		assertIsNonNull(profileID);
		const profile = tree.get(profileID);
		assertIsNonNull(profile);

		if (isEditing) {
			return <DeathLogCardEditor node={profile} />;
		}

		return <DeathLog parent={profile} />;
	} else if (
		subjectID == undefined &&
		profileID == undefined &&
		isValidNodeID(gameID)
	) {
		assertIsNonNull(gameID);
		const game = tree.get(gameID);
		assertIsNonNull(game);

		if (isEditing) {
			return <DeathLogCardEditor node={game} />;
		}

		return <DeathLog parent={game} />;
	}

	return <ErrorPage error={new Error(CONSTANTS.ERROR.URL)} />;
}
