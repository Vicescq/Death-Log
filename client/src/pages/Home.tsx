import Card from "../components/Card";
import AddItemCard from "../components/addItemCard/AddItemCard";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import usePostDeathLog from "../hooks/usePostDeathLog";
import useHistoryContext from "../hooks/useHistoryContext";
import CardWrapper from "../components/CardWrapper";
import type { HandleAddGame } from "../components/addItemCard/AddItemCardProps";
import { changeCompletedStatus } from "../utils/eventHandlers";
import useUpdateURLMap from "../hooks/useUpdateURLMap";
import useUUIDContext from "../hooks/useUUIDContext";
import type { Game } from "../model/TreeNodeModel";
import TreeContextManager from "../features/TreeContextManager";
import { useErrorBoundary } from "react-error-boundary";
import HistoryContextManager from "../features/HistoryContextManager";

export default function Home() {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const [uuid] = useUUIDContext();
	const { showBoundary } = useErrorBoundary();

	const handleAdd: HandleAddGame = (
		inputText: string,
		dateStartR: boolean | undefined,
		dateEndR: boolean | undefined,
	) => {
		try {
			const node = TreeContextManager.createGame(inputText, tree, {
				dateStartR: dateStartR,
				dateEndR: dateEndR,
			});
			const { treeCopy, actions } = TreeContextManager.addNode(
				tree,
				node,
			);
			setTree(treeCopy);
			setHistory(
				HistoryContextManager.updateActionHistory(history, actions),
			);
		} catch (err) {
			showBoundary(err);
		}
	};

	function handleDelete(node: Game) {
		const bool = window.confirm();
		if (bool) {
			const { treeCopy, actions } = TreeContextManager.deleteNode(
				tree,
				node,
			);
			setTree(treeCopy);
			setHistory(
				HistoryContextManager.updateActionHistory(history, actions),
			);
		}
	}

	function handleCompletedStatus(game: Game, newStatus: boolean) {
		const { treeCopy, actions } = changeCompletedStatus(
			game,
			newStatus,
			tree,
		);
		setTree(treeCopy);
		setHistory(HistoryContextManager.updateActionHistory(history, actions));
	}

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
				/>
			);
		});
	}

	useUpdateURLMap(tree, urlMap, setURLMap);
	usePostDeathLog(uuid, history, setHistory);

	return (
		<>
			<AddItemCard pageType="Game" modalSchema={"AddItemCard-Home"} handleAdd={handleAdd}/>

			<CardWrapper cards={createCards()} />
		</>
	);
}
