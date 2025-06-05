import type {
	InputEditTargetField,
	ModalListItemInputEditType,
	ModalListItemToggleType,
} from "../components/modals/ModalListItemTypes";
import type { ToggleSetting } from "../components/Toggle";
import type { TreeStateType } from "../contexts/treeContext";
import Game from "../model/Game";
import Profile from "../model/Profile";
import Subject, { type DeathType } from "../model/Subject";
import type TreeNode from "../model/TreeNodeModel";

export function createModalListItemInputEdit(
	settingLabel: string,
	targetField: InputEditTargetField,
) {
	return {
		type: "inputEdit",
		settingLabel: settingLabel,
		targetField: targetField,
	} as ModalListItemInputEditType;
}

export function createModalListItemToggle(
	settingLabel: string,
	toggleSetting: ToggleSetting,
	enable: boolean,
) {
	return {
		type: "toggle",
		settingLabel: settingLabel,
		toggleSetting: toggleSetting,
		enable: enable,
	} as ModalListItemToggleType;
}

export function createCardCSS(treeNode: Game | Profile | Subject, resetDeathTypeMode: boolean) {
	const enabledCSS =
		"bg-amber-200 border-2 rounded-2xl shadow-[5px_2px_0px_rgba(0,0,0,1)]";
	let cardCol = "bg-zomp";
	if (treeNode instanceof Subject && !treeNode.notable) {
		cardCol = "bg-amber-500";
	}

	const cardCSS = treeNode.completed
		? "bg-raisinblack text-amber-200"
		: `${cardCol} text-black`;
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

export function generateCardDeathCounts(treeNode: Game | Profile | Subject, tree: TreeStateType) {
	const deathCount =
		treeNode instanceof Game || treeNode instanceof Profile
			? treeNode.getDeaths(tree)
			: treeNode.getDeaths();
	const fullTries =
		treeNode instanceof Game || treeNode instanceof Profile
			? treeNode.getFullTries(tree)
			: treeNode.fullTries;
	const resets =
		treeNode instanceof Game || treeNode instanceof Profile
			? treeNode.getResets(tree)
			: treeNode.resets;
	return {deathCount, fullTries, resets};
}
