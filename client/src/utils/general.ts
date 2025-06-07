import type { ToggleSetting } from "../components/modals/ModalListItemToggle";

export function createShallowCopyMap<T>(map: Map<string, T>) {
    const objLiteralFromTree = Object.fromEntries(map);
    const objLiteralFromTreeShallowCopy = { ...objLiteralFromTree };
    return new Map(Object.entries(objLiteralFromTreeShallowCopy));
}

export function deleteUndefinedValues(obj: any) {
    Object.keys(obj).forEach((key) => obj[key] === undefined ? delete obj[key] : null);
}

export function isSubjectContext(setting: ToggleSetting | undefined) {
    return setting == "boss" || setting == "location" || setting == "other"
}