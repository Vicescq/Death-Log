import Card from "../components/Card";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useHistoryContext from "../hooks/useHistoryContext";
import usePostDeathLog from "../hooks/usePostDeathLog";
import CardWrapper from "../components/CardWrapper";
import { useRef, useState } from "react";
import Modal from "../components/modals/Modal";
import ModalListItemToggle from "../components/modals/ModalListItemToggle";
import { createProfile } from "../utils/tree";
import AddItemCard from "../components/addItemCard/AddItemCard";
import type { HandleAddProfile } from "../components/addItemCard/AddItemCardProps";
import { changeToggleSettingState } from "../utils/eventHandlers";
import {
	createModalListItemInputEdit,
	createModalListItemToggle,
} from "../utils/ui";
import useUpdateURLMap from "../hooks/useUpdateURLMap";
import useUUIDContext from "../hooks/useUUIDContext";
import type { Profile } from "../model/TreeNodeModel";
import TreeContextService from "../services/TreeContextService";
import { updateActionHistory } from "../utils/history";

export default function GameProfiles({ gameID }: { gameID: string }) {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const [uuid] = useUUIDContext();

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
		challenge: boolean | undefined,
	) => {
		const node = createProfile(inputText, tree, gameID, {
			date: date,
			challenge: challenge,
		});
		const { treeCopy, actions } = TreeContextService.addNode(tree, node);
		setTree(treeCopy);
		setHistory(updateActionHistory(history, actions));
	};

	function handleDelete(node: Profile) {
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

	function handleCompletedStatus(profile: Profile, newStatus: boolean) {
		const updatedProfile: Profile = { ...profile, completed: newStatus };
		const { treeCopy, actions } = TreeContextService.updateNode(
			tree,
			updatedProfile,
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
	usePostDeathLog(uuid, history, setHistory);

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
