import Card from "../components/Card";
import AddItemCard from "../components/addItemCard/AddItemCard";
import Game from "../model/Game";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import usePostDeathLog from "../hooks/usePostDeathLog";
import useHistoryContext from "../hooks/useHistoryContext";
import Action from "../model/Action";
import CardWrapper from "../components/CardWrapper";
import { useRef, useState } from "react";
import Modal from "../components/modals/Modal";
import ModalListItemToggle from "../components/modals/ModalListItemToggle";
import ContextService from "../services/ContextService";
import { createGame } from "../utils/tree";
import type { HandleAddGame } from "../components/addItemCard/AddItemCardProps";
import { changeToggleSettingState } from "../utils/eventHandlers";
import {
	createModalListItemInputEdit,
	createModalListItemToggle,
} from "../utils/ui";
import migrateAllToDB from "../utils/migration";
import APIService from "../services/APIService";
import info from "../assets/info.svg"

export default function Home() {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
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
		const node = createGame(inputText, tree, date);
		ContextService.addNodes(tree, setTree, urlMap, setURLMap, [node]);
		ContextService.updateActionHistory(
			history,
			setHistory,
			new Action("add", [node]),
		);
	};

	function handleDelete(node: Game) {
		const bool = window.confirm();
		if (bool) {
			const deletedNodes = ContextService.deleteNode(
				tree,
				setTree,
				node,
				urlMap,
				setURLMap,
			);
			ContextService.updateActionHistory(
				history,
				setHistory,
				new Action("delete", [...deletedNodes!]),
			);
		}
	}

	function handleCompletedStatus(game: Game, newStatus: boolean) {
		const bool = window.confirm();
		if (bool) {
			game.completed = newStatus;
			ContextService.updateNode(game, tree, setTree);
			ContextService.updateActionHistory(
				history,
				setHistory,
				new Action("update", [game]),
			);
		}
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

	usePostDeathLog(history, setHistory);
	
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
