import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import usePostDeathLog from "../../hooks/usePostDeathLog";
import CardWrapper from "../../components/card/CardWrapper";
import useUpdateURLMap from "../../hooks/useUpdateURLMap";
import type { Game } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import homePageHandlers from "./homePageHandlers";

export default function Home() {
	const {
		tree,
		setTree,
		urlMap,
		setURLMap,
		history,
		setHistory,
		uuid,
		showBoundary,
	} = useMainPageContexts();
	const { handleAdd, handleDelete, handleCompletedStatus } = homePageHandlers(
		tree,
		setTree,
		history,
		setHistory,
		showBoundary,
	);

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

	useUpdateURLMap(tree, urlMap, setURLMap);
	usePostDeathLog(uuid, history, setHistory);

	return (
		<>
			<AddItemCard
				pageType="Game"
				modalSchema={"AddItemCard-Home"}
				handleAdd={handleAdd}
				tree={tree}
				parentID="ROOT_NODE"
			/>

			<CardWrapper cards={createCards()} />
		</>
	);
}
