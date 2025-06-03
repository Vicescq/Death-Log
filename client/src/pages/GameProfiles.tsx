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
import ContextService from "../services/ContextService";
import { createProfile } from "../utils/tree";
import AddItemCard from "../components/addItemCard/AddItemCard";
import type { HandleAddProfile } from "../components/addItemCard/AddItemCardProps";
import { changeToggleSettingState } from "../utils/eventHandlers";
import { createModalListItemInputEdit, createModalListItemToggle } from "../utils/ui";

export default function GameProfiles({ gameID }: { gameID: string }) {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const addItemCardModalRef = useRef<HTMLDialogElement | null>(null);

	const [addItemCardModalListItemArray, setAddItemCardModalListItemArray] =
		useState([createModalListItemToggle("AUTO-DATE", "autoDate", true), createModalListItemToggle("CHALLENGE", "challenge", false)]);

	const [cardModalListItemArray, setCardModalListItemArray] = useState([createModalListItemInputEdit("Edit Name:", "name")]);

	const handleAdd: HandleAddProfile = (
		inputText: string,
		date: null | undefined,
	) => {
		const node = createProfile(inputText, tree, date, gameID);
		ContextService.addNodes(tree, setTree, urlMap, setURLMap, [node]);
		ContextService.updateActionHistory(
			history,
			setHistory,
			new Action("add", [node]),
			new Action("update", [tree.get(gameID!)!]),
		);
	};

	function handleDelete(node: Profile) {
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
				new Action("update", [tree.get(node.parentID!)!]),
			);
		}
	}

	function handleCompletedStatus(profile: Profile, newStatus: boolean) {
		const bool = window.confirm();
		if (bool) {
			profile.completed = newStatus;
			ContextService.updateNode(profile, tree, setTree);
			ContextService.updateActionHistory(
				history,
				setHistory,
				new Action("update", [profile]),
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

	usePostDeathLog(history, setHistory);

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
