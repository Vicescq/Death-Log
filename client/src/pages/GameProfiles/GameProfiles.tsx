import Card from "../../components/card/Card";
import usePostDeathLog from "../../hooks/usePostDeathLog";
import CardWrapper from "../../components/card/CardWrapper";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import useUpdateURLMap from "../../hooks/useUpdateURLMap";
import type { Profile } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import gameProfileHandlers from "./gameProfileHandlers";

export default function GameProfiles({ gameID }: { gameID: string }) {
	const { tree, setTree, urlMap, setURLMap, history, setHistory, uuid } =
		useMainPageContexts();

	const { handleAdd, handleDelete, handleCompletedStatus } =
		gameProfileHandlers(tree, setTree, history, setHistory, gameID);

	function createCards() {
		return tree.get(gameID)?.childIDS.map((nodeID, index) => {
			const profile = tree.get(nodeID) as Profile;
			return (
				<Card
					key={index}
					tree={tree}
					treeNode={profile}
					handleCompletedStatus={(newStatus) =>
						handleCompletedStatus(profile, newStatus)
					}
					modalSchema={"Card-Profile"}
					handleDelete={() => handleDelete(profile)}
				/>
			);
		});
	}

	useUpdateURLMap(tree, urlMap, setURLMap);
	usePostDeathLog(uuid, history, setHistory);

	return (
		<>
			<AddItemCard
				pageType="Profile"
				modalSchema={"AddItemCard-Profile"}
				handleAdd={handleAdd}
			/>
			<CardWrapper cards={createCards()} />
		</>
	);
}
