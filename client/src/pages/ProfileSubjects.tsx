import Card, { type HandleDeathCountOperation } from "../components/Card";
import AddItemCard from "../components/addItemCard/AddItemCard";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useHistoryContext from "../hooks/useHistoryContext";
import usePostDeathLog from "../hooks/usePostDeathLog";
import CardWrapper from "../components/CardWrapper";
import { useRef, useState } from "react";
import Modal from "../components/modals/Modal";
import ModalListItemToggle from "../components/modals/ModalListItemToggle";
import { createSubject } from "../utils/tree";
import { changeToggleSettingState } from "../utils/eventHandlers";
import {
	createModalListItemInputEdit,
	createModalListItemToggle,
} from "../utils/ui";
import useUpdateURLMap from "../hooks/useUpdateURLMap";
import useUUIDContext from "../hooks/useUUIDContext";
import type { Subject, DeathType } from "../model/TreeNodeModel";
import TreeContextService from "../services/TreeContextService";
import { updateActionHistory } from "../utils/history";

export default function ProfileSubjects({ profileID }: { profileID: string }) {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const [uuid] = useUUIDContext();
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
		dateStart: null | undefined,
		notable: boolean | undefined,
	) {
		const node = createSubject(inputText, profileID, {
			dateStart: dateStart,
			notable: notable,
		});
		const { treeCopy, actions } = TreeContextService.addNode(tree, node);
		setTree(treeCopy);
		setHistory(updateActionHistory(history, actions));
	}

	function handleDelete(node: Subject) {
		const bool = window.confirm();
		if (bool) {
			const { treeCopy, actions } = TreeContextService.deleteNode(
				tree,
				node,
			);
			setTree(treeCopy);
			setHistory(updateActionHistory(history, actions));
		}
	}

	function handleDeathCount(
		subject: Subject,
		deathType: DeathType,
		operation: HandleDeathCountOperation,
	) {
		let updatedSubject: Subject = { ...subject };
		if (operation == "add") {
			deathType == "fullTries"
				? updatedSubject.fullTries++
				: updatedSubject.resets++;
		} else {
			deathType == "fullTries"
				? updatedSubject.fullTries--
				: updatedSubject.resets--;
		}
		updatedSubject.fullTries < 0 ? (updatedSubject.fullTries = 0) : null;
		updatedSubject.resets < 0 ? (updatedSubject.resets = 0) : null;
		const { treeCopy, actions } = TreeContextService.updateNode(
			tree,
			updatedSubject,
		);
		setTree(treeCopy);
		setHistory(updateActionHistory(history, actions));
	}

	function handleCompletedStatus(subject: Subject, newStatus: boolean) {
		const updatedSubject: Subject = { ...subject, completed: newStatus };
		const { treeCopy, actions } = TreeContextService.updateNode(
			tree,
			updatedSubject,
		);
		setTree(treeCopy);
		setHistory(updateActionHistory(history, actions));
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

	useUpdateURLMap(tree, urlMap, setURLMap);
	usePostDeathLog(uuid, history, setHistory);
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
