import Card from "../components/card/Card";
import AddItemCard from "../components/addItemCard/AddItemCard";
import CardWrapper from "../components/card/CardWrapper";
import type { Game, TangibleTreeNodeParent } from "../model/TreeNodeModel";
import useMainPageContexts from "../hooks/useMainPageContexts";
import HistoryContextManager from "../features/HistoryContextManager";
import TreeContextManager from "../features/TreeContextManager";
import URLMapContextManager from "../features/URLMapContextManager";
import IndexedDBService from "../services/IndexedDBService";

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

	function handleAdd(inputText: string, overrides: Partial<Game>){
		console.log(overrides)
		const node = TreeContextManager.createGame(inputText, tree, overrides);

		// memory data structures
		const { updatedTree: updatedTreeIP, action } =
			TreeContextManager.addNode(tree, node);
		const { updatedTree } = TreeContextManager.updateNodeParent(
			node,
			updatedTreeIP,
			"add",
		);
		const tangibleParentNode = action.targets as TangibleTreeNodeParent;
		const updatedURLMap = URLMapContextManager.addURL(
			urlMap,
			tangibleParentNode,
		);
		const updatedHistory = HistoryContextManager.updateActionHistory(
			history,
			[action],
		);

		// db's
		try {
			IndexedDBService.addNode(
				action.targets,
				localStorage.getItem("email")!,
			);
			IndexedDBService.addURL(
				tangibleParentNode,
				localStorage.getItem("email")!,
			);
		} catch (error) {
			console.error(error);
		}

		setTree(updatedTree);
		setURLMap(updatedURLMap);
		setHistory(updatedHistory);
	};

	function handleDelete(node: Game) {
		const bool = window.confirm();
		if (bool) {
			// memory data structures
			const { updatedTree: updatedTreeIP, action } =
				TreeContextManager.deleteNode(tree, node);
			const { updatedTree } = TreeContextManager.updateNodeParent(
				node,
				updatedTreeIP,
				"delete",
			);
			const updatedURLMap = URLMapContextManager.deleteURL(
				urlMap,
				action.targets,
			);
			const updatedHistory = HistoryContextManager.updateActionHistory(
				history,
				[action],
			);

			// db's
			try {
				IndexedDBService.deleteNode(action.targets);
				IndexedDBService.deleteURLS(action.targets);
			} catch (error) {
				console.error(error);
			}

			setTree(updatedTree);
			setURLMap(updatedURLMap);
			setHistory(updatedHistory);
		}
	}

	function handleCompletedStatus(game: Game, newStatus: boolean) {
		// memory data structures
		const { updatedTree: updatedTreeIP, action } =
			TreeContextManager.updateNodeCompletion(game, newStatus, tree);
		const { updatedTree } = TreeContextManager.updateNodeParent(
			game,
			updatedTreeIP,
			"update",
		);
		const updatedHistory = HistoryContextManager.updateActionHistory(
			history,
			[action],
		);

		// db's
		try {
			IndexedDBService.updateNode(
				action.targets,
				localStorage.getItem("email")!,
			);
		} catch (error) {
			console.error(error);
		}

		setTree(updatedTree);
		setHistory(updatedHistory);
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
					handleDelete={() => handleDelete(game)}
				/>
			);
		});
	}

	// useGetDeathLog(tree, setTree, user, setHistory);

	return (
		<>
			<AddItemCard pageType="Game" handleAdd={handleAdd} />

			<CardWrapper cards={createCards()} />
		</>
	);
}
