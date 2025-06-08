import { ToggleSettingSubjectContexts } from "../components/modals/ModalListItemToggle";

export function createShallowCopyMap<T>(map: Map<string, T>) {
    const objLiteralFromTree = Object.fromEntries(map);
    const objLiteralFromTreeShallowCopy = { ...objLiteralFromTree };
    return new Map(Object.entries(objLiteralFromTreeShallowCopy));
}

export function deleteUndefinedValues(obj: any) {
    Object.keys(obj).forEach((key) => obj[key] === undefined ? delete obj[key] : null);
}

export function isSubjectContext(setting: string) {
    for (let i = 0; i < ToggleSettingSubjectContexts.length; i++){
        if (ToggleSettingSubjectContexts[i] == setting){
            return true;
        }
    }
    return false;
}