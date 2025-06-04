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
import Modal from "../components/modals/Modal";
import ModalListItemToggle from "../components/modals/ModalListItemToggle";
import ContextService from "../services/ContextService";
import { createNewTreeNodeRef, createSubject } from "../utils/tree";
import { changeToggleSettingState } from "../utils/eventHandlers";
import {
	createModalListItemInputEdit,
	createModalListItemToggle,
} from "../utils/ui";

export default function ProfileSubjects({ profileID }: { profileID: string }) {
	const [tree, dispatchTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, dispatchHistory] = useHistoryContext();
	const addItemCardModalRef = useRef<HTMLDialogElement | null>(null);

	const [addItemCardModalListItemArray, setAddItemCardModalListItemArray] =
		useState([
			createModalListItemToggle("AUTO-DATE", "autoDate", true),
			createModalListItemToggle("NOTABLE", "notable", true),
		]);

	const [cardModalListItemArray, setCardModalListItemArray] = useState([
		createModalListItemInputEdit("Edit Name:", "name"),
	]);

	function handleAdd(
		inputText: string,
		date: null | undefined,
		notable: boolean,
	) {
		const node = createSubject(inputText, date, profileID, notable);
		dispatchTree(new Action("add", [node]));
	}

	function handleDelete(node: Subject) {
		const bool = window.confirm();
		if (bool) {
			dispatchTree(new Action("delete", [node]));
		}
	}

	function handleDeathCount(
		subject: Subject,
		deathType: DeathType,
		operation: HandleDeathCountOperation,
	) {
		const updatedSubject = createNewTreeNodeRef(subject) as Subject;
		if (operation == "add") {
			deathType == "fullTry"
				? updatedSubject.fullTries++
				: updatedSubject.resets++;
		} else {
			deathType == "fullTry"
				? updatedSubject.fullTries--
				: updatedSubject.resets--;
		}
		dispatchTree(new Action("update", [updatedSubject]));
	}

	function handleCompletedStatus(subject: Subject, newStatus: boolean) {
		const updatedGame = createNewTreeNodeRef(subject);
		updatedGame.completed = newStatus;
		dispatchTree(new Action("update", [updatedGame]));
	}

	function handleToggleSetting(status: boolean, index: number) {
		const newState = changeToggleSettingState(
			addItemCardModalListItemArray,
			status,
			index,
		);
		setAddItemCardModalListItemArray(newState);
	}

	function handleDetailsSetting(subject: Subject, inputText: string) {}

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
					handleDetailsSettingSubmit={(inputText) =>
						handleDetailsSetting(subject, inputText)
					}
				/>
			);
		});
	}

	// usePostDeathLog(history, setHistory);
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
