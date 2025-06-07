import type { ToggleSetting } from "../Toggle";
import type { InputEditTargetField } from "./ModalListItemInputEdit";

export type ModalListItemType = "inputEdit" | "toggle"

export interface ModalListItem {
    type: ModalListItemType
    settingLabel: string
}

export interface ModalListItemInputEditType extends ModalListItem{
    type: "inputEdit";
    targetField: InputEditTargetField
    change: string;
}

export interface ModalListItemToggleType extends ModalListItem {
    type: "toggle";
    toggleSetting: ToggleSetting;
    enable: boolean;
}

