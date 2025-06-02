import Card, { type HandleDeathCountOperation } from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import Subject, { type DeathType } from "../classes/Subject";
import ContextManager from "../classes/ContextManager";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import Action from "../classes/Action";
import useHistoryContext from "../hooks/useHistoryContext";
import useSaveDeathLogStatus from "../hooks/useSaveDeathLogStatus";
import CardWrapper from "../components/CardWrapper";
import { useState } from "react";
import type { ToggleSetting } from "../components/Toggle";
import type { ModalListItemState } from "../components/Modal";

export default function ProfileSubjects({ profileID }: { profileID: string }) {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();

	const initModalListItemStateArray: ModalListItemState[] = [];
	const autoDateToggleSetting: ModalListItemState = {
		toggleSetting: {
			setting: "autoDate",
			enable: true,
		},
	};
	const notableToggleSetting: ModalListItemState = {
		toggleSetting: {
			setting: "notable",
			enable: true,
		},
	};
	const bossToggleSetting: ModalListItemState = {
		toggleSetting: {
			setting: "boss",
			enable: true,
		},
	};
	const locationToggleSetting: ModalListItemState = {
		toggleSetting: {
			setting: "location",
			enable: false,
		},
	};
	initModalListItemStateArray.push(
		autoDateToggleSetting,
		notableToggleSetting,
		bossToggleSetting,
		locationToggleSetting,
	);
	const [modalListItemStateArray, setModalListItemStateArray] = useState(
		initModalListItemStateArray,
	);

	function handleAdd(
		inputText: string,
		autoDate: boolean = true,
		notable: boolean = true,
	) {
		const node = UIHelper.handleAddHelper(
			inputText,
			tree,
			autoDate,
			"subject",
			profileID,
			notable,
		);
		ContextManager.addNodes(tree, setTree, urlMap, setURLMap, [node]);
		ContextManager.updateActionHistory(
			history,
			setHistory,
			new Action("add", [node]),
			new Action("update", [tree.get(profileID!)!]),
		);
	}

	function handleDelete(node: Subject) {
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

	function handleDeathCount(
		subject: Subject,
		deathType: DeathType,
		operation: HandleDeathCountOperation,
	) {
		const bool = window.confirm();
		if (bool) {
			if (operation == "add") {
				deathType == "fullTry" ? subject.fullTries++ : subject.resets++;
				ContextManager.updateNode(subject, tree, setTree);
				ContextManager.updateActionHistory(
					history,
					setHistory,
					new Action("update", [subject]),
				);
			} else {
				deathType == "fullTry" ? subject.fullTries-- : subject.resets--;
				ContextManager.updateNode(subject, tree, setTree);
				ContextManager.updateActionHistory(
					history,
					setHistory,
					new Action("update", [subject]),
				);
			}
		}
	}

	function handleCompletedStatus(subject: Subject, newStatus: boolean) {
		const bool = window.confirm();
		if (bool) {
			subject.completed = newStatus;
			ContextManager.updateNode(subject, tree, setTree);
			ContextManager.updateActionHistory(
				history,
				setHistory,
				new Action("update", [subject]),
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
						toggleSetting: {
							...state.toggleSetting!,
							enable: status,
							setting: setting,
						},
					};
				}
				return state;
			});

		setModalListItemStateArray(newModalListItemStateArray);
	}

	function createCards() {
		return tree.get(profileID)?.childIDS.map((nodeID, index) => {
			const subject = tree.get(nodeID) as Subject;
			return (
				<Card
					key={index}
					tree={tree}
					treeNode={subject}
					handleDelete={() => handleDelete(subject)}
					handleDeathCount={(deathType, operation) =>
						handleDeathCount(subject, deathType, operation)
					}
					handleCompletedStatus={(newStatus) =>
						handleCompletedStatus(subject, newStatus)
					}
				/>
			);
		});
	}

	useSaveDeathLogStatus(history, setHistory);
	return (
		<>
			<AddItemCard
				handleAdd={handleAdd}
				itemType="subject"
				handleToggleSetting={handleToggleSetting}
				modalListItemStateArray={modalListItemStateArray}
			/>
			<CardWrapper cards={createCards()} />
		</>
	);
}
