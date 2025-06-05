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
import useUpdateHistory from "../hooks/useUpdateHistory";
import useUUIDContext from "../hooks/useUUIDContext";
import type { Action } from "../model/Action";
import type { Game } from "../model/TreeNodeModel";
import { createGame, identifyDeletedChildrenIDS } from "../utils/tree";

export default function Home() {
	const [tree, dispatchTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const [uuid] = useUUIDContext();
	const [intents, setIntents] = useState<Action[]>([]);
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
		console.log(node)
		dispatchTree({ type: "add", targets: [node] });
		setIntents([{ type: "add", targets: [node] }]);
	};

	function handleDelete(node: Game) {
		const bool = window.confirm();
		if (bool) {
			const ids = identifyDeletedChildrenIDS(node, tree);
			dispatchTree({
				type: "delete",
				targets: ["ROOT_NODE"].concat(ids),
			});
			setIntents([{ type: "delete", targets: ids }]);
		}
	}

	function handleCompletedStatus(game: Game, newStatus: boolean) {
		const updatedGame: Game = { ...game, completed: newStatus };
		dispatchTree({ type: "update", targets: [updatedGame] });
		setIntents([{ type: "update", targets: [updatedGame] }]);
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
	useUpdateHistory(tree, intents, history, setHistory);
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
