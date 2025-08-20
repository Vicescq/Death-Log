import Card from "../components/card/Card";
import AddItemCard from "../components/addItemCard/AddItemCard";
import CardWrapper from "../components/card/CardWrapper";
import type { DistinctTreeNode, Game } from "../model/TreeNodeModel";
import useMainPageContexts from "../hooks/useMainPageContexts";
import HistoryContextManager from "../features/HistoryContextManager";
import TreeContextManager from "../features/TreeContextManager";
import URLMapContextManager from "../features/URLMapContextManager";
import IndexedDBService from "../services/IndexedDBService";
import type { CardModalStateGame } from "../components/card/CardTypes";
import Modal from "../components/modal/Modal";
import AlertModalBody from "../components/modal/AlertModalBody";
import { useRef } from "react";

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
const modalRef = useRef<HTMLDialogElement | null>(null);
	function handleAdd(inputText: string) {
		const node = TreeContextManager.createGame(inputText, tree);

		// memory data structures
		const { updatedTree: updatedTreeIP, action } =
			TreeContextManager.addNode(tree, node);
		const { updatedTree } = TreeContextManager.updateNodeParent(
			node,
			updatedTreeIP,
			"add",
		);
		const updatedURLMap = URLMapContextManager.addURL(
			urlMap,
			action.targets,
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
				action.targets,
				localStorage.getItem("email")!,
			);
		} catch (error) {
			console.error(error);
		}

		setTree(updatedTree);
		setURLMap(updatedURLMap);
		setHistory(updatedHistory);
	}

	function handleDelete(node: DistinctTreeNode) {
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

	function handleModalSave(
		node: DistinctTreeNode,
		overrides: CardModalStateGame,
	) {
		if (node.type == "game") {
			const editedNode = TreeContextManager.createGame(node.name, tree, {
				...overrides,
			});
			editedNode.id = node.id;

			// in memory
			const { updatedTree: updatedTreeIP, action: actionUpdateSelf } =
				TreeContextManager.updateNode(tree, editedNode);
			const { updatedTree: updatedTree, action: actionUpdateParent } =
				TreeContextManager.updateNodeParent(
					editedNode,
					updatedTreeIP,
					"update",
				);
			const updatedHistory = HistoryContextManager.updateActionHistory(
				history,
				[actionUpdateSelf, actionUpdateParent],
			);

			// db's
			/////////

			setTree(updatedTree);
			setHistory(updatedHistory);
		} else {
			throw new Error("DEV ERROR!");
		}
	}

	function handleCompletedStatus(node: DistinctTreeNode, newStatus: boolean) {
		// memory data structures
		const { updatedTree: updatedTreeIP, action } =
			TreeContextManager.updateNodeCompletion(node, newStatus, tree);
		const { updatedTree } = TreeContextManager.updateNodeParent(
			node,
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
		console.log("dsadasdsaasdasdsadasdas");
	}

	function createCards() {
		return tree.get("ROOT_NODE")?.childIDS.map((nodeID, index) => {
			const game = tree.get(nodeID) as Game;
			return (
				<Card
					key={index}
					tree={tree}
					node={game}
					handleDelete={handleDelete}
					handleCompletedStatus={() =>
						handleCompletedStatus(game, game.completed)
					}
					handleModalSave={(overrides) =>
						handleModalSave(game, overrides)
					}
				/>
			);
		});
	}

	// useGetDeathLog(tree, setTree, user, setHistory);

	return (
		<>
			<AddItemCard pageType="game" handleAdd={handleAdd} />
			<button onClick={() => modalRef.current?.showModal()}>dsdsadsad</button>
			<CardWrapper cards={createCards()} />
			<Modal modalRef={modalRef} isAlertModal={true} modalBody={<AlertModalBody alert={{
				msg: "",
				isAlert: false
			}}/>} />
		</>
	);
}
