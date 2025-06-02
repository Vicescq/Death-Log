import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Profile from "../classes/Profile";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import useHistoryContext from "../hooks/useHistoryContext";
import Action from "../classes/Action";
import useSaveDeathLogStatus from "../hooks/useSaveDeathLogStatus";
import CardWrapper from "../components/CardWrapper";
import { useRef, useState } from "react";
import type { ModalListItemToggleType } from "../components/modals/ModalListItemTypes";
import Modal from "../components/modals/Modal";
import ModalListItemToggle from "../components/modals/ModalListItemToggle";

export default function GameProfiles({ gameID }: { gameID: string }) {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const addItemCardModalRef = useRef<HTMLDialogElement | null>(null);

	const initAddItemCardModalListItemArray: ModalListItemToggleType[] = [];
	initAddItemCardModalListItemArray.push(
		{
			type: "toggle",
			enable: true,
			settingLabel: "AUTO-DATE",
			toggleSetting: "autoDate",
		},
		{
			type: "toggle",
			enable: false,
			settingLabel: "CHALLENGE",
			toggleSetting: "challenge",
		},
	);
	const [addItemCardModalListItemArray, setAddItemCardModalListItemArray] =
		useState(initAddItemCardModalListItemArray);

	function handleAdd(inputText: string, autoDate: boolean = true) {
		const node = UIHelper.handleAddHelper(
			inputText,
			tree,
			autoDate,
			"profile",
			gameID,
		);
		ContextManager.addNodes(tree, setTree, urlMap, setURLMap, [node]);
		ContextManager.updateActionHistory(
			history,
			setHistory,
			new Action("add", [node]),
			new Action("update", [tree.get(gameID!)!]),
		);
	}

	function handleDelete(node: Profile) {
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
				new Action("update", [tree.get(node.parentID!)!]),
			);
		}
	}

	function handleCompletedStatus(profile: Profile, newStatus: boolean) {
		const bool = window.confirm();
		if (bool) {
			profile.completed = newStatus;
			ContextManager.updateNode(profile, tree, setTree);
			ContextManager.updateActionHistory(
				history,
				setHistory,
				new Action("update", [profile]),
			);
		}
	}

	function handleToggleSetting(status: boolean, index: number) {
		const newState = addItemCardModalListItemArray.map((li, i) => {
			if (index == i) {
				li = { ...li, enable: status };
			}
			return li;
		});
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
				/>
			);
		});
	}

	useSaveDeathLogStatus(history, setHistory);

	return (
		<>
			<AddItemCard
				modalRef={addItemCardModalRef}
				itemType="profile"
				handleAdd={handleAdd}
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
