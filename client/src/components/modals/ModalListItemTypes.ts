import type { ToggleSetting } from "../Toggle";

type ModalListItemType = "inputEdit" | "toggle"

type InputEditTargetField = "name" | "date" | "challenge" | "notable"

interface ModalListItem {
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

