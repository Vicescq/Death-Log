import type { TreeStateType } from "../contexts/treeContext";
import Game from "../model/Game";
import Profile from "../model/Profile";
import Subject from "../model/Subject";
import type TreeNode from "../model/TreeNode";

export function sanitizeUserEntry(inputText: string) {
    inputText = inputText.trim();
    if (inputText.includes("?") || inputText == "") {
        throw new Error("Invalid string!");
    }
    return inputText;
}

export function createNodePath(inputText: string, parentID: string, tree: TreeStateType) {
    let path: string;
    inputText = sanitizeUserEntry(inputText);
    if (parentID != "ROOT_NODE") {
        const parentNode = tree.get(parentID)!
        path = parentNode.path + "/" + inputText.replaceAll(" ", "-");
    }
    else {
        path = inputText.replaceAll(" ", "-");
    }
    return path;
}

export function createGame(
    inputText: string,
    tree: TreeStateType,
    date: null | undefined,
) {
    inputText = sanitizeUserEntry(inputText);
    const path = createNodePath(inputText, "ROOT_NODE", tree);
    return new Game(inputText, path, "ROOT_NODE", undefined, undefined, date);
}

export function createProfile(
    inputText: string,
    tree: TreeStateType,
    date: null | undefined,
    parentID: string,
) {
    inputText = sanitizeUserEntry(inputText);
    const path = createNodePath(inputText, parentID, tree);
    return new Profile(inputText, path, parentID, undefined, undefined, date);
}

export function createSubject(
    inputText: string,
    date: null | undefined,
    parentID: string,
    notable: boolean,
) {
    inputText = sanitizeUserEntry(inputText);
    return new Subject(inputText, parentID, notable, undefined, undefined, undefined, date);
}

export function createShallowCopyMap<T>(map: Map<string, T>) {
    const objLiteralFromTree = Object.fromEntries(map);
    const objLiteralFromTreeShallowCopy = { ...objLiteralFromTree };
    return new Map(Object.entries(objLiteralFromTreeShallowCopy));
}

export function sortChildIDS(parentNode: TreeNode, tree: TreeStateType) {
    const sorted = parentNode.childIDS.toSorted((a, b) => {
        const nodeA = tree.get(a);
        const nodeB = tree.get(b);

        if (nodeA && nodeB) {
            if (nodeA instanceof Subject && nodeB instanceof Subject) {

                let unnotableFactorA = 0;
                let unnotableFactorB = 0;

                if (!nodeA.notable) {
                    unnotableFactorA += -1;
                    if (nodeA.completed){
                        unnotableFactorA += 1;
                    }
                }

                if (!nodeB.notable) {
                    unnotableFactorB += -1;
                    if (nodeB.completed){
                        unnotableFactorB += 1;
                    }
                }

                return Number(nodeA.completed) + unnotableFactorA - (Number(nodeB.completed) + unnotableFactorB);
            }
            return Number(nodeA.completed) - Number(nodeB.completed);
        }
        else {
            return 0
        }

    });
    return sorted
}