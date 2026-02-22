import { useParams, useSearchParams } from "react-router";
import { CONSTANTS } from "../../../shared/constants";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsNonNull } from "../../utils/asserts";
import ErrorPage from "../ErrorPage";
import DeathLogCardEditor from "./card-editor/DeathLogCardEditor";
import DeathLogCounter from "./counter/DeathLogCounter";
import DeathLog from "./DeathLog";
import DeathLogProfileGroupEdit from "./profile-group-edit/DeathLogProfileGroupEdit";

export default function DeathLogRouter() {
	const params = useParams();
	const [qParams] = useSearchParams();
	const tree = useDeathLogStore((state) => state.tree);

	const id = params.id;
	const isEditing = qParams.get("edit") === "main";
	const isProfileGroupEditing = qParams.get("edit") === "pg";

	if (id && tree.has(id) && id != "ROOT_NODE") {
		const node = tree.get(id);
		assertIsNonNull(node);
		switch (node.type) {
			case "game":
				if (isEditing) {
					return <DeathLogCardEditor node={node} />;
				}
				return <DeathLog parent={node} />;
			case "profile":
				if (isEditing) {
					return <DeathLogCardEditor node={node} />;
				}

				if (isProfileGroupEditing) {
					return <DeathLogProfileGroupEdit profile={node} />;
				}

				return <DeathLog parent={node} />;
			case "subject":
				if (isEditing) {
					return <DeathLogCardEditor node={node} />;
				}

				return <DeathLogCounter subject={node} />;
		}
	}

	return <ErrorPage error={new Error(CONSTANTS.ERROR.URL)} />;
}
