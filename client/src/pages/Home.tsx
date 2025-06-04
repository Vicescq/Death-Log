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

export default function Home() {
	const [tree, dispatchTree] = useTreeContext();
	const [urlMap, dispatchURLMap] = useURLMapContext();
	const [history, dispatchHistory] = useHistoryContext();
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
		dispatchTree(new Action("add", [node]));
	};

	function handleDelete(node: Game) {
		const bool = window.confirm();
		if (bool) {
			console.log("Deleting node: ", node.id);
			dispatchTree(new Action("delete", [node]));
		}
	}

	function handleCompletedStatus(game: Game, newStatus: boolean) {
		const bool = window.confirm();
		if (bool) {

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

	// usePostDeathLog(history, setHistory);
	
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
