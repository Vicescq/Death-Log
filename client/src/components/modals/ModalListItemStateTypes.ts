import type { InputEditTargetField } from "./ModalListItemInputEdit";
import type { ToggleSetting } from "./ModalListItemToggle";

export type ModalListItemType = "inputEdit" | "toggle"
export type ModalListItemDistinctState = ModalListItemInputEditState | ModalListItemToggleState;

export interface ModalListItemState {
    type: ModalListItemType
    settingLabel: string
}

export interface ModalListItemInputEditState extends ModalListItemState{
    type: "inputEdit";
    targetField: InputEditTargetField
    change: string;
}

export interface ModalListItemToggleState extends ModalListItemState {
    type: "toggle";
    toggleSetting: ToggleSetting;
    enable: boolean;
}

