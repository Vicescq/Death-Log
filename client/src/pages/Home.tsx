import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Game from "../classes/Game";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import useSaveDeathLogStatus from "../hooks/useSaveDeathLogStatus";
import useHistoryContext from "../hooks/useHistoryContext";
import Action from "../classes/Action";
import CardWrapper from "../components/CardWrapper";
import { useState } from "react";
import type { ModalListItemState } from "../components/Modal";
import type { ToggleSetting } from "../components/Toggle";

export default function Home() {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();

	const initModalListItemStateArray: ModalListItemState[] = [];

	for (let i = 0; i < 10; i++) {
		const modalToggleSetting: ModalListItemState = {
			index: i,
			toggleSetting: {
				setting: "autoDate",
				enable: true,
			},
		};
		initModalListItemStateArray.push(modalToggleSetting);
	}
	const [modalListItemStateArray, setModalListItemStateArray] = useState(
		initModalListItemStateArray,
	);

	function handleAdd(inputText: string, autoDate: boolean = true) {
		const node = UIHelper.handleAddHelper(
			inputText,
			tree,
			autoDate,
			"game",
		);
		ContextManager.addNodes(tree, setTree, urlMap, setURLMap, [node]);
		ContextManager.updateActionHistory(
			history,
			setHistory,
			new Action("add", [node]),
		);
	}

	function handleDelete(node: Game) {
		const bool = window.confirm();
		if (bool) {
			const deletedNodes = ContextManager.deleteNode(
				tree,
				setTree,
				node,
				urlMap,
				setURLMap,
			);
			ContextManager.updateActionHistory(
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
			ContextManager.updateNode(game, tree, setTree);
			ContextManager.updateActionHistory(
				history,
				setHistory,
				new Action("update", [game]),
			);
		}
	}

	function handleToggleSetting(
		setting: ToggleSetting,
		status: boolean,
		index: number,
	) {
		const newModalListItemStateArray: ModalListItemState[] =
			modalListItemStateArray.map((state, i) => {
				if (i == index) {
					return {
						...state,
						toggleSetting: { ...state.toggleSetting!, enable: status, setting: setting },
					};
				} 
				return state
			});

		setModalListItemStateArray(newModalListItemStateArray);
	}

	function createCards() {
		return tree.get("ROOT_NODE")?.childIDS.map((nodeID, index) => {
			const game = tree.get(nodeID) as Game;
			return (
				<Card
					key={index}
					tree={tree}
					treeNode={game}
					handleDelete={() => handleDelete(game)}
					handleCompletedStatus={(newStatus) =>
						handleCompletedStatus(game, newStatus)
					}
				/>
			);
		});
	}
	console.log(modalListItemStateArray);
	useSaveDeathLogStatus(history, setHistory);

	return (
		<>
			<AddItemCard
				itemType="game"
				handleAdd={handleAdd}
				modalListItemStateArray={modalListItemStateArray}
				handleToggleSetting={handleToggleSetting}
			/>
			<CardWrapper cards={createCards()} />
		</>
	);
}
