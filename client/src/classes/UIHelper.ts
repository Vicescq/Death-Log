import type { TreeStateType, TreeContextType } from "../contexts/treeContext";
import Game from "./Game";
import Profile from "./Profile";
import Subject from "./Subject";
import type { TreeNodeSerializableType } from "./TreeNode";
import type TreeNode from "./TreeNode";

export default class UIHelper {
    constructor() { };

    static sanitizeUserEntry(inputText: string) {
        inputText = inputText.trim();
        if (inputText.includes("?") || inputText == "") {
            throw new Error("Invalid string!");
        }
        return inputText;
    }

    static createNodePath(inputText: string, parentID: string | null = null, tree: TreeStateType) {
        let path: string;
        inputText = UIHelper.sanitizeUserEntry(inputText);
        if (parentID != null && tree.get(parentID)?.type != "subject") {
            const parentNode = tree.get(parentID)!
            path = parentNode.path + "/" + inputText.replaceAll(" ", "-");
        }
        else {
            path = inputText.replaceAll(" ", "-");
        }
        return path;
    }

    static handleAddHelper(
        inputText: string,
        tree: TreeStateType,
        autoDate: boolean,
        nodeToBeAdded: TreeNodeSerializableType,
        parentID?: string,
        notable?: boolean,
    ) {
        inputText = UIHelper.sanitizeUserEntry(inputText);
        const path = UIHelper.createNodePath(inputText, parentID, tree);

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

}