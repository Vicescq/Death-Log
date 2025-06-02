import Game from "../model/Game";
import Profile from "../model/Profile";
import Subject from "../model/Subject";
import TreeNode, { type TreeNodeSerializableType } from "../model/TreeNode";
import type { TreeStateType } from "../contexts/treeContext";
import { sanitizeUserEntry, createNodePath } from "./treeUtils";

export function handleAddHelper(
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
};