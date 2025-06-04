import Card from "../components/Card";
import Profile from "../model/Profile";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useHistoryContext from "../hooks/useHistoryContext";
import Action from "../model/Action";
import usePostDeathLog from "../hooks/usePostDeathLog";
import CardWrapper from "../components/CardWrapper";
import { useRef, useState } from "react";
import Modal from "../components/modals/Modal";
import ModalListItemToggle from "../components/modals/ModalListItemToggle";
import {
	createNewTreeNodeRef,
	createProfile,
	identifyDeletedChildrenIDS,
} from "../utils/tree";
import AddItemCard from "../components/addItemCard/AddItemCard";
import type { HandleAddProfile } from "../components/addItemCard/AddItemCardProps";
import { changeToggleSettingState } from "../utils/eventHandlers";
import {
	createModalListItemInputEdit,
	createModalListItemToggle,
} from "../utils/ui";
import useUpdateURLMap from "../hooks/useUpdateURLMap";
import useUpdateHistory from "../hooks/useUpdateHistory";

export default function GameProfiles({ gameID }: { gameID: string }) {
	const [tree, dispatchTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const [intents, setIntents] = useState<Action[]>([]);
	const addItemCardModalRef = useRef<HTMLDialogElement | null>(null);

	const [addItemCardModalListItemArray, setAddItemCardModalListItemArray] =
		useState([
			createModalListItemToggle("AUTO-DATE", "autoDate", true),
			createModalListItemToggle("CHALLENGE", "challenge", false),
		]);

	const [cardModalListItemArray, setCardModalListItemArray] = useState([
		createModalListItemInputEdit("Edit Name:", "name"),
	]);

	const handleAdd: HandleAddProfile = (
		inputText: string,
		date: null | undefined,
	) => {
		const node = createProfile(inputText, tree, date, gameID);
		dispatchTree({ type: "add", payload: [node] });
		setIntents([
			new Action("add", [node]),
			new Action("toBeUpdated", [gameID]),
		]);
	};

	function handleDelete(node: Profile) {
		const bool = window.confirm();
		if (bool) {
			const ids = identifyDeletedChildrenIDS(node, tree);
			dispatchTree({
				type: "delete",
				payload: [gameID].concat(node.id).concat(ids),
			});
			setIntents([
				new Action("delete", [node.id].concat(ids)),
				new Action("toBeUpdated", [gameID]),
			]);
		}
	}

	function handleCompletedStatus(profile: Profile, newStatus: boolean) {
		const updatedGame = createNewTreeNodeRef(profile);
		updatedGame.completed = newStatus;
		dispatchTree({ type: "update", payload: [updatedGame] });
		setIntents([new Action("update", [updatedGame.id])]);
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
		return tree.get(gameID)?.childIDS.map((nodeID, index) => {
			const profile = tree.get(nodeID) as Profile;
			return (
				<Card
					key={index}
					tree={tree}
					treeNode={profile}
					handleDelete={() => handleDelete(profile)}
					handleCompletedStatus={(newStatus) =>
						handleCompletedStatus(profile, newStatus)
					}
					modalListItemArray={cardModalListItemArray}
				/>
			);
		});
	}

	useUpdateURLMap(tree, urlMap, setURLMap);
	useUpdateHistory(tree, intents, history, setHistory);
	// usePostDeathLog(history, setHistory);

	return (
		<>
			<AddItemCard
				modalRef={addItemCardModalRef}
				itemType="profile"
				handleAdd={handleAdd}
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
