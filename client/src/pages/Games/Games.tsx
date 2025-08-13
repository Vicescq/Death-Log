import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import CardWrapper from "../../components/card/CardWrapper";
import type { Game } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import gamesHandlers from "./gamesHandlers";

export default function Games() {
	const {
		tree,
		setTree,
		urlMap,
		setURLMap,
		history,
		setHistory,
		user,
		setUser,
	} = useMainPageContexts();
	const { handleAdd, handleDelete, handleCompletedStatus } =
		gamesHandlers(tree, setTree, history, setHistory, urlMap, setURLMap);

	function createCards() {
		return tree.get("ROOT_NODE")?.childIDS.map((nodeID, index) => {
			const game = tree.get(nodeID) as Game;
			return (
				<Card
					key={index}
					tree={tree}
					treeNode={game}
					handleCompletedStatus={(newStatus) =>
						handleCompletedStatus(game, newStatus)
					}
					modalSchema={"Card-Home"}
					handleDelete={() => handleDelete(game)}
				/>
			);
		});
	}

	// useGetDeathLog(tree, setTree, user, setHistory);

	return (
		<>
			<AddItemCard
				pageType="Game"
				handleAdd={handleAdd}
			/>

			<CardWrapper cards={createCards()} />
		</>
	);
}
