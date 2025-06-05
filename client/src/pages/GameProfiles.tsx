import Card from "../components/Card";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useHistoryContext from "../hooks/useHistoryContext";
import usePostDeathLog from "../hooks/usePostDeathLog";
import CardWrapper from "../components/CardWrapper";
import { useRef, useState } from "react";
import Modal from "../components/modals/Modal";
import ModalListItemToggle from "../components/modals/ModalListItemToggle";
import { createProfile, identifyDeletedChildrenIDS } from "../utils/tree";
import AddItemCard from "../components/addItemCard/AddItemCard";
import type { HandleAddProfile } from "../components/addItemCard/AddItemCardProps";
import { changeToggleSettingState } from "../utils/eventHandlers";
import {
	createModalListItemInputEdit,
	createModalListItemToggle,
} from "../utils/ui";
import useUpdateURLMap from "../hooks/useUpdateURLMap";
import useUpdateHistory from "../hooks/useUpdateHistory";
import useUUIDContext from "../hooks/useUUIDContext";
import type { Action, DistinctAction } from "../model/Action";
import type { Profile } from "../model/TreeNodeModel";

export default function GameProfiles({ gameID }: { gameID: string }) {
	const [tree, dispatchTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const [uuid] = useUUIDContext();
	const [intents, setIntents] = useState<DistinctAction[]>([]);
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
		dispatchTree({ type: "add", targets: [node] });
		setIntents([
			{ type: "add", targets: [node] },
			{ type: "toBeUpdated", targets: [gameID] },
		]);
	};

	function handleDelete(node: Profile) {
		const bool = window.confirm();
		if (bool) {
			const ids = identifyDeletedChildrenIDS(node, tree);
			dispatchTree({
				type: "delete",
				targets: [gameID].concat(ids),
			});
			setIntents([
				{ type: "delete", targets: ids },
				{ type: "toBeUpdated", targets: [gameID] },
			]);
		}
	}

	function handleCompletedStatus(profile: Profile, newStatus: boolean) {
		const updatedProfile: Profile = { ...profile, completed: newStatus };
		dispatchTree({ type: "update", targets: [updatedProfile] });
		setIntents([
			{ type: "update", targets: [updatedProfile] },
			{ type: "toBeUpdated", targets: [gameID] },
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
