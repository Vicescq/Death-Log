import type { ToggleSetting } from "../Toggle";

type ModalListItemType = "inputEdit" | "toggle"

type InputEditTargetField = "name" | "date" | "challenge" | "notable"

interface ModalListItem {
    type: ModalListItemType
    settingLabel: string
}

export interface ModalListItemInputEdit extends ModalListItem{
    type: "inputEdit";
    targetField: string
}

export interface ModalListItemToggle extends ModalListItem {
    type: "toggle";
    toggleSetting: ToggleSetting;
    enable: boolean;
}

