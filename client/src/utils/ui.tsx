import type { InputEditTargetField } from "../components/modals/ModalListItemInputEdit";
import type { ToggleSetting } from "../components/modals/ModalListItemToggle";
import type {
	ModalListItemInputEditState,
	ModalListItemToggleState,
} from "../components/modals/ModalListItemStateTypes";
import type { TreeStateType } from "../contexts/treeContext";
import type { DistinctTreeNode } from "../model/TreeNodeModel";
import { getDeaths } from "./treeUtils";
import type { ModalSchema } from "../components/modals/Modal";


export function createModalListItemInputEditState(
	settingLabel: string,
	targetField: InputEditTargetField,
): ModalListItemInputEditState {
	return {
		type: "inputEdit",
		settingLabel: settingLabel,
		targetField: targetField,
		change: "",
	};
}

export function createModalListItemToggleState(
	settingLabel: string,
	toggleSetting: ToggleSetting,
	enable: boolean,
): ModalListItemToggleState {
	return {
		type: "toggle",
		settingLabel: settingLabel,
		toggleSetting: toggleSetting,
		enable: enable,
	};
}

export function createCardCSS(
	treeNode: DistinctTreeNode,
	resetDeathTypeMode: boolean,
) {
	const enabledCSS =
		"bg-amber-200 border-2 rounded-2xl shadow-[5px_2px_0px_rgba(0,0,0,1)]";
	let cardCol = "bg-zomp";
	if (treeNode.type == "subject" && !treeNode.notable) {
		cardCol = "bg-amber-500";
	}

	let cardCSS: string;
	if (treeNode.type == "subject" && treeNode.completed && !treeNode.notable) {
		cardCSS = "bg-red-800 text-amber-200";
	} else {
		cardCSS = treeNode.completed
			? "bg-raisinblack text-amber-200"
			: `${cardCol} text-black`;
	}

	const readOnlyToggleCSS = treeNode.completed ? enabledCSS : "";
	const resetToggleCSS = resetDeathTypeMode ? enabledCSS : "";
	const settersBtnDisplay = treeNode.completed ? "hidden" : "";
	const readOnlyEnabledCSS = treeNode.completed
		? "bg-amber-200 rounded-l shadow-[5px_2px_0px_rgba(0,0,0,1)]"
		: "";
	return {
		cardCSS,
		readOnlyToggleCSS,
		resetToggleCSS,
		settersBtnDisplay,
		readOnlyEnabledCSS,
	};
}

export function generateCardDeathCounts(
	treeNode: DistinctTreeNode,
	tree: TreeStateType,
) {
	const deathCount = getDeaths(treeNode, tree, "both");
	const fullTries = getDeaths(treeNode, tree, "fullTries");
	const resets = getDeaths(treeNode, tree, "resets");
	return { deathCount, fullTries, resets };
}

export function createModalState(
	modalSchema: ModalSchema,
) {
	const state: (ModalListItemInputEditState | ModalListItemToggleState)[] =
		[];
	switch (modalSchema) {
		case "AddItemCard-Home":
		case "AddItemCard-Profile":
			state.push(
				createModalListItemToggleState(
					"Reliable Date (Start)",
					"dateStartR",
					true,
			
				),
				createModalListItemToggleState(
					"Reliable Date (End)",
					"dateEndR",
					true,
				),
			);
			break;
		case "AddItemCard-Subject":
			state.push(
				createModalListItemToggleState(
					"Reliable Date (Start)",
					"dateStartR",
					true,
			
				),
				createModalListItemToggleState(
					"Reliable Date (End)",
					"dateEndR",
					true,
			
				),
				createModalListItemToggleState("Notable", "notable", true),
				createModalListItemToggleState("Boss", "boss", true),
				createModalListItemToggleState("Location", "location", false),
				createModalListItemToggleState("Other", "other", false),
			);
			break;
		case "Card-Home":
		case "Card-Profile":
		case "Card-Subject":
			state.push(createModalListItemInputEditState("Name:", "name"));
	}
	return state;
}
