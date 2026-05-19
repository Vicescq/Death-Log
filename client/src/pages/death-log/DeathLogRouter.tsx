import { useParams, useSearchParams } from "react-router";
import { CONSTANTS } from "../../../shared/constants";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsNonNull } from "../../utils/asserts";
import ErrorPage from "../ErrorPage";
import CardEditor from "./card-editor/CardEditor";
import Counter from "./counter/Counter";
import DeathLog from "./DeathLog";
import ProfileGroup from "./profile-group/ProfileGroup";

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
					return <CardEditor node={node} />;
				}
				return <DeathLog parent={node} key={node.id} />; // needs key prop in order to treat any /log/:id sibling nodes as diff views instead of same, which in turn forces a rerun of every react state logic for consistency
			case "profile":
				if (isEditing) {
					return <CardEditor node={node} />;
				}

				if (isProfileGroupEditing) {
					return <ProfileGroup profile={node} />;
				}

				return <DeathLog parent={node} />;
			case "subject":
				if (isEditing) {
					return <CardEditor node={node} />;
				}

				return <Counter subject={node} />;
		}
	}

	return <ErrorPage error={new Error(CONSTANTS.ERROR.URL)} />;
}
