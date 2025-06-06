import Card from "../components/Card";
import AddItemCard from "../components/addItemCard/AddItemCard";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import usePostDeathLog from "../hooks/usePostDeathLog";
import useHistoryContext from "../hooks/useHistoryContext";
import CardWrapper from "../components/CardWrapper";
import { useRef, useState } from "react";
import Modal from "../components/modals/Modal";
import ModalListItemToggle from "../components/modals/ModalListItemToggle";
import type { HandleAddGame } from "../components/addItemCard/AddItemCardProps";
import { changeCompletedStatus, changeToggleSettingState } from "../utils/eventHandlers";
import {
	createModalListItemInputEdit,
	createModalListItemToggle,
} from "../utils/ui";
import useUpdateURLMap from "../hooks/useUpdateURLMap";
import useUUIDContext from "../hooks/useUUIDContext";
import type { Game } from "../model/TreeNodeModel";
import TreeContextManager from "../features/TreeContextManager";
import {  useErrorBoundary } from "react-error-boundary";
import type { ModalListItemToggleType } from "../components/modals/ModalListItemTypes";
import HistoryContextManager from "../features/HistoryContextManager";

export default function Home() {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const [uuid] = useUUIDContext();
	const addItemCardModalRef = useRef<HTMLDialogElement | null>(null);
	const { showBoundary } = useErrorBoundary();

	const [addItemCardModalListItemArray, setAddItemCardModalListItemArray] =
		useState([createModalListItemToggle("Reliable Date (Start)", "dateStartR", true), createModalListItemToggle("Reliable Date (End)", "dateEndR", true)]);

	const [cardModalListItemArray, setCardModalListItemArray] = useState([
		createModalListItemInputEdit("Edit Name:", "name"),
	]);

	const handleAdd: HandleAddGame = (inputText: string) => {
		try {
			const node = TreeContextManager.createGame(inputText, tree, {});
			const { treeCopy, actions } = TreeContextManager.addNode(
				tree,
				node,
			);
			setTree(treeCopy);
			setHistory(HistoryContextManager.updateActionHistory(history, actions));
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
			setHistory(HistoryContextManager.updateActionHistory(history, actions));
		}
	}

	function handleCompletedStatus(game: Game, newStatus: boolean) {
		const {treeCopy, actions} = changeCompletedStatus(game, newStatus, tree);
		setTree(treeCopy);
		setHistory(HistoryContextManager.updateActionHistory(history, actions));
	}

	function handleToggleSetting(status: boolean, index: number) {
		const newState = changeToggleSettingState(
			addItemCardModalListItemArray,
			status,
			index,
		);
		setAddItemCardModalListItemArray(newState);
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
					handleDelete={() => handleDelete(game)}
					modalListItemArray={cardModalListItemArray}
				/>
			);
		});
	}

	useUpdateURLMap(tree, urlMap, setURLMap);
	usePostDeathLog(uuid, history, setHistory);

	return (
		<>
			<AddItemCard
				handleAdd={handleAdd}
				itemType="game"
				modalRef={addItemCardModalRef}
				modalListItemArray={addItemCardModalListItemArray}
			>
				<Modal
					modalRef={addItemCardModalRef}
					listItems={addItemCardModalListItemArray.map(
						(li, index) => {
							return (
								<ModalListItemToggle
									key={index}
									modalListItem={li}
									index={index}
									handleToggleSetting={handleToggleSetting}
								/>
							);
						},
					)}
					utilityBtns={[]}
				/>
			</AddItemCard>
			<CardWrapper cards={createCards()} />
		</>
	);
}
