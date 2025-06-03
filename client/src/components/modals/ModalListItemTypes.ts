import type { ToggleSetting } from "../Toggle";

export type ModalListItemType = "inputEdit" | "toggle"

export type InputEditTargetField = "name" | "date" | "challenge" | "notable"

export interface ModalListItem {
    type: ModalListItemType
    settingLabel: string
}

export interface ModalListItemInputEditType extends ModalListItem{
    type: "inputEdit";
    targetField: InputEditTargetField
}

export interface ModalListItemToggleType extends ModalListItem {
    type: "toggle";
    toggleSetting: ToggleSetting;
    enable: boolean;
}

