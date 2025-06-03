import type {
	InputEditTargetField,
	ModalListItemInputEditType,
	ModalListItemToggleType,
} from "../components/modals/ModalListItemTypes";
import type { ToggleSetting } from "../components/Toggle";

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
