import type { TreeStateType } from "../contexts/treeContext";

export function sanitizeUserEntry(inputText: string) {
    inputText = inputText.trim();
    if (inputText.includes("?") || inputText == "") {
        throw new Error("Invalid string!");
    }
    return inputText;
}

export function createNodePath(inputText: string, parentID: string | null = null, tree: TreeStateType) {
    let path: string;
    inputText = sanitizeUserEntry(inputText);
    if (parentID != null && tree.get(parentID)?.type != "subject") {
        const parentNode = tree.get(parentID)!
        path = parentNode.path + "/" + inputText.replaceAll(" ", "-");
    }
    else {
        path = inputText.replaceAll(" ", "-");
    }
    return path;
}