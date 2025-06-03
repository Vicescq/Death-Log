import Card, { type HandleDeathCountOperation } from "../components/Card";
import AddItemCard from "../components/addItemCard/AddItemCard";
import Subject, { type DeathType } from "../model/Subject";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import Action from "../model/Action";
import useHistoryContext from "../hooks/useHistoryContext";
import usePostDeathLog from "../hooks/usePostDeathLog";
import CardWrapper from "../components/CardWrapper";
import { useRef, useState } from "react";
import type { ModalListItemInputEditType, ModalListItemToggleType } from "../components/modals/ModalListItemTypes";
import Modal from "../components/modals/Modal";
import ModalListItemToggle from "../components/modals/ModalListItemToggle";
import ContextService from "../services/ContextService";
import { createSubject } from "../utils/treeUtils";
import { changeToggleSettingState } from "../utils/eventHandlerUtils";

export default function ProfileSubjects({ profileID }: { profileID: string }) {
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
			enable: true,
			settingLabel: "NOTABLE",
			toggleSetting: "notable",
		},
	);
	const [addItemCardModalListItemArray, setAddItemCardModalListItemArray] =
		useState(initAddItemCardModalListItemArray);

	const initCardModalListItemArray: (
		| ModalListItemToggleType
		| ModalListItemInputEditType
	)[] = [];
	initCardModalListItemArray.push({
		type: "inputEdit",
		settingLabel: "Edit Name:",
		targetField: "name",
	});
	const [cardModalListItemArray, setCardModalListItemArray] = useState(
		initCardModalListItemArray,
	);

	function handleAdd(
		inputText: string,
		date: null | undefined,
		notable: boolean,
	) {
		const node = createSubject(inputText, date, profileID, notable);
		ContextService.addNodes(tree, setTree, urlMap, setURLMap, [node]);
		ContextService.updateActionHistory(
			history,
			setHistory,
			new Action("add", [node]),
			new Action("update", [tree.get(profileID!)!]),
		);
	}

	function handleDelete(node: Subject) {
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

	function handleDeathCount(
		subject: Subject,
		deathType: DeathType,
		operation: HandleDeathCountOperation,
	) {
		const bool = window.confirm();
		if (bool) {
			if (operation == "add") {
				deathType == "fullTry" ? subject.fullTries++ : subject.resets++;
				ContextService.updateNode(subject, tree, setTree);
				ContextService.updateActionHistory(
					history,
					setHistory,
					new Action("update", [subject]),
				);
			} else {
				deathType == "fullTry" ? subject.fullTries-- : subject.resets--;
				ContextService.updateNode(subject, tree, setTree);
				ContextService.updateActionHistory(
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
			ContextService.updateNode(subject, tree, setTree);
			ContextService.updateActionHistory(
				history,
				setHistory,
				new Action("update", [subject]),
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
				itemType="subject"
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
