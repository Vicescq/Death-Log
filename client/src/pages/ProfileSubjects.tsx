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
import { createSubject, identifyDeletedChildrenIDS } from "../utils/tree";
import { changeToggleSettingState } from "../utils/eventHandlers";
import {
	createModalListItemInputEdit,
	createModalListItemToggle,
} from "../utils/ui";
import useUpdateURLMap from "../hooks/useUpdateURLMap";
import useUpdateHistory from "../hooks/useUpdateHistory";
import useUUIDContext from "../hooks/useUUIDContext";
import type { DistinctAction } from "../model/Action";
import type { Subject, DeathType } from "../model/TreeNodeModel";

export default function ProfileSubjects({ profileID }: { profileID: string }) {
	const [tree, dispatchTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const [uuid] = useUUIDContext();
	const [intents, setIntents] = useState<DistinctAction[]>([]);
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
		notable: boolean | undefined,
	) {
		const node = createSubject(inputText, profileID, {
			date: date,
			notable: notable,
		});
		dispatchTree({ type: "add", targets: [node] });
		setIntents([
			{ type: "add", targets: [node] },
			{ type: "toBeUpdated", targets: [profileID] },
		]);
	}

	function handleDelete(node: Subject) {
		const bool = window.confirm();
		if (bool) {
			const ids = identifyDeletedChildrenIDS(node, tree);
			dispatchTree({
				type: "delete",
				targets: [profileID].concat(ids),
			});
			setIntents([
				{ type: "delete", targets: ids },
				{ type: "toBeUpdated", targets: [profileID] },
			]);
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
		dispatchTree({
			type: "update",
			targets: [updatedSubject],
		});
		setIntents([{ type: "toBeUpdated", targets: [updatedSubject.id] }]);
	}

	function handleCompletedStatus(subject: Subject, newStatus: boolean) {
		const updatedSubject: Subject = { ...subject, completed: newStatus };
		dispatchTree({ type: "update", targets: [updatedSubject] });
		setIntents([
			{ type: "update", targets: [updatedSubject] },
			{ type: "toBeUpdated", targets: [profileID] },
		]);
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
	useUpdateHistory(tree, intents, history, setHistory);
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
