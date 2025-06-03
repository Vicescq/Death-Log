import type { ModalListItemToggleType } from "../components/modals/ModalListItemTypes";

export function changeToggleSettingState(addItemCardModalListItemArray: ModalListItemToggleType[], status: boolean, index: number) {
    return addItemCardModalListItemArray.map((li, i) => {
        if (index == i) {
            li = { ...li, enable: status };
        }
        return li;
    });
}