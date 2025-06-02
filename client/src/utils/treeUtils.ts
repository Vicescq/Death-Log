import type { TreeStateType } from "../contexts/treeContext";
import Game from "../model/Game";
import Profile from "../model/Profile";
import Subject from "../model/Subject";
import TreeNode, { type TreeNodeSerializableType } from "../model/TreeNode";

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

export function createNode(
    inputText: string,
    tree: TreeStateType,
    autoDate: boolean,
    nodeToBeAdded: TreeNodeSerializableType,
    parentID?: string,
    notable?: boolean,
) {
    inputText = sanitizeUserEntry(inputText);
    const path = createNodePath(inputText, parentID, tree);

    let node: TreeNode;
    switch (nodeToBeAdded) {
        case "game":
            node = autoDate ? new Game(inputText.trim(), path, "ROOT_NODE")
                : new Game(inputText.trim(), path, "ROOT_NODE", undefined, undefined, null);
            break;
        case "profile":
            node = autoDate ? new Profile(inputText, path, parentID!) : new Profile(inputText, path, parentID!, undefined, undefined, null);
            break;
        default:
            node = autoDate ? new Subject(inputText, parentID!, notable) : new Subject(inputText, parentID!, notable, undefined, undefined, undefined, null);
            break;
    }
    return node
}

export function createShallowCopyMap<T>(map: Map<string, T>) {
    const objLiteralFromTree = Object.fromEntries(map);
    const objLiteralFromTreeShallowCopy = { ...objLiteralFromTree };
    return new Map(Object.entries(objLiteralFromTreeShallowCopy));
}