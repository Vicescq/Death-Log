import type { OptionDataValue } from "../SelectDropDown";
import type { InputEditTargetField } from "./ModalListItemInputEdit";
import type { ToggleSetting } from "./ModalListItemToggle";

export type ModalListItemType = "inputEdit" | "toggle" | "dropDown"
export type ModalListItemDistinctState = ModalListItemInputEditState | ModalListItemToggleState | ModalListItemDropDownState;

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

export interface ModalListItemDropDownState extends ModalListItemState {
    type: "dropDown";
    selected: OptionDataValue;
}