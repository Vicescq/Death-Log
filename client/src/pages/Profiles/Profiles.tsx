import Card from "../../components/card/Card";
import CardWrapper from "../../components/card/CardWrapper";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import type { Profile } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import profilesHandlers from "./profilesHandlers";

export default function Profiles({ gameID }: { gameID: string }) {
	const { tree, setTree, urlMap, setURLMap, history, setHistory } =
		useMainPageContexts();

	const { handleAdd, handleDelete, handleCompletedStatus } = profilesHandlers(
		tree,
		setTree,
		history,
		setHistory,
		gameID,
		urlMap,
		setURLMap,
	);

	function createCards() {
		return tree.get(gameID)?.childIDS.map((nodeID, index) => {
			const profile = tree.get(nodeID) as Profile;
			return (
				<Card
					key={index}
					tree={tree}
					node={profile}
					handleCompletedStatus={(newStatus) =>
						handleCompletedStatus(profile, newStatus)
					}
					modalSchema={"Card-Profile"}
					handleDelete={() => handleDelete(profile)}
				/>
			);
		});
	}

	return (
		<>
			<AddItemCard
				pageType="profile"
				modalSchema={"AddItemCard-Profile"}
				handleAdd={handleAdd}
				tree={tree}
				parentID={gameID}
			/>
			<CardWrapper cards={createCards()} />
		</>
	);
}
