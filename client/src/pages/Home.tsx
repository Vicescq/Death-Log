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
import { changeToggleSettingState } from "../utils/eventHandlers";
import {
	createModalListItemInputEdit,
	createModalListItemToggle,
} from "../utils/ui";
import useUpdateURLMap from "../hooks/useUpdateURLMap";
import useUUIDContext from "../hooks/useUUIDContext";
import type { Game } from "../model/TreeNodeModel";
import { createGame } from "../utils/tree";
import TreeContextService from "../services/TreeContextService";
import { updateActionHistory } from "../utils/history";

export default function Home() {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const [uuid] = useUUIDContext();
	const addItemCardModalRef = useRef<HTMLDialogElement | null>(null);

	const [addItemCardModalListItemArray, setAddItemCardModalListItemArray] =
		useState([createModalListItemToggle("AUTO-DATE", "autoDate", true)]);

	const [cardModalListItemArray, setCardModalListItemArray] = useState([
		createModalListItemInputEdit("Edit Name:", "name"),
	]);

	const handleAdd: HandleAddGame = (
		inputText: string,
		date: null | undefined,
	) => {
		const node = createGame(inputText, tree, { date: date });
		const {treeCopy, actions} = TreeContextService.addNode(tree, node);
		setTree(treeCopy);
		updateActionHistory(history, setHistory, actions);
	};

	function handleDelete(node: Game) {
		const bool = window.confirm();
		if (bool) {
			const {treeCopy, actions} = TreeContextService.deleteNode(tree, node);
			setTree(treeCopy);
			updateActionHistory(history, setHistory, actions);
		}
	}

	function handleCompletedStatus(game: Game, newStatus: boolean) {
		const updatedGame: Game = { ...game, completed: newStatus };
		const {treeCopy, actions} = TreeContextService.updateNode(tree, updatedGame);
		setTree(treeCopy);
		updateActionHistory(history, setHistory, actions);
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
