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
import type { ToggleSetting } from "../components/Toggle";
import type { ModalListItemToggle } from "../components/modals/ModalListItemTypes";

export default function Home() {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();

	const initAddItemCardModalListItemArray: ModalListItemToggle[] = [];
	
	initAddItemCardModalListItemArray.push({type: "toggle", enable: true, settingLabel: "AUTO-DATE", toggleSetting: "autoDate"});
	const [addItemCardModalListItemArray, setAddItemCardModalListItemArray] = useState(
		initAddItemCardModalListItemArray,
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
		const newState = addItemCardModalListItemArray.map((li, i) => {
			
			if (index == i){
				li = {...li, enable: status }
			}
			return li
		})
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
					handleDelete={() => handleDelete(game)}
					handleCompletedStatus={(newStatus) =>
						handleCompletedStatus(game, newStatus)
					}
					modalListItemStateArray={[]}
				/>
			);
		});
	}

	useSaveDeathLogStatus(history, setHistory);

	return (
		<>
			<AddItemCard
				itemType="game"
				handleAdd={handleAdd}
				modalListItemArray={addItemCardModalListItemArray}
				handleToggleSetting={handleToggleSetting}
			/>
			<CardWrapper cards={createCards()} />
		</>
	);
}
