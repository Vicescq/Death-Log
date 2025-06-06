import type { TreeStateType } from "../contexts/treeContext";
import type { RootNode, TreeNode, Game, Profile, Subject, TangibleTreeNodeParent, DistinctTreeNode, DeathType } from "../model/TreeNodeModel";
import { v4 as uuidv4 } from 'uuid';

export function sanitizeUserEntry(inputText: string) {
    inputText = inputText.trim();
    if (inputText.includes("?") || inputText == "") {
        throw new Error("Invalid string!");
    }
    return inputText;
}

export function createNodePath(inputText: string, parentID: string, tree: TreeStateType) {
    let path: string;
    if (parentID != "ROOT_NODE") {
        const parentNode = tree.get(parentID)! as TangibleTreeNodeParent
        path = parentNode.path + "/" + inputText.replaceAll(" ", "-");
    }
    else {
        path = inputText.replaceAll(" ", "-");
    }
    return path;
}

export function createRootNode() {
    const rootNode: RootNode = { type: "ROOT_NODE", id: "ROOT_NODE", childIDS: [], parentID: null };
    return rootNode
}

export function createGame(
    inputText: string,
    tree: TreeStateType,
    overrides: Partial<Game>,
) {
    inputText = sanitizeUserEntry(inputText);
    const path = createNodePath(inputText, "ROOT_NODE", tree);
    const defaultGame: Game = {
        type: "game",
        id: uuidv4(),
        childIDS: [],
        parentID: "ROOT_NODE",
        name: inputText,
        completed: false,
        notes: null,
        dateStart: new Date().toISOString(),
        dateEnd: null,
        path: path,
        genre: null,
    };
    deleteUndefinedValues(overrides);
    return {
        ...defaultGame,
        ...overrides
    } as Game
}

export function createProfile(
    inputText: string,
    tree: TreeStateType,
    parentID: string,
    overrides: Partial<Profile>,
) {
    inputText = sanitizeUserEntry(inputText);
    const path = createNodePath(inputText, parentID, tree);
    const defaultProfile: Profile = {
        type: "profile",
        id: uuidv4(),
        childIDS: [],
        parentID: parentID,
        name: inputText,
        completed: false,
        notes: null,
        dateStart: new Date().toISOString(),
        dateEnd: null,
        path: path,
        challenge: false,
    };
    deleteUndefinedValues(overrides);
    return {
        ...defaultProfile,
        ...overrides
    } as Profile
}

export function createSubject(
    inputText: string,
    parentID: string,
    overrides: Partial<Subject>,
) {
    inputText = sanitizeUserEntry(inputText);
    const defaultSubject: Subject = {
        type: "subject",
        id: uuidv4(),
        childIDS: [],
        parentID: parentID,
        name: inputText,
        completed: false,
        notes: null,
        dateStart: new Date().toISOString(),
        dateEnd: null,
        notable: true,
        fullTries: 0,
        resets: 0,
    };
    deleteUndefinedValues(overrides);
    return {
        ...defaultSubject,
        ...overrides
    } as Subject
}

export function createShallowCopyMap<T>(map: Map<string, T>) {
    const objLiteralFromTree = Object.fromEntries(map);
    const objLiteralFromTreeShallowCopy = { ...objLiteralFromTree };
    return new Map(Object.entries(objLiteralFromTreeShallowCopy));
}

export function sortChildIDS(parentNode: TreeNode, tree: TreeStateType) {
    const sorted = parentNode.childIDS.toSorted((a, b) => {
        const nodeA = tree.get(a) as DistinctTreeNode;
        const nodeB = tree.get(b) as DistinctTreeNode;

        if (nodeA && nodeB) {
            if (nodeA.type == "subject" && nodeB.type == "subject") {

                let unnotableFactorA = 0;
                let unnotableFactorB = 0;

                if (!nodeA.notable) {
                    unnotableFactorA += -1;
                    if (nodeA.completed) {
                        unnotableFactorA += 1;
                    }
                }

                if (!nodeB.notable) {
                    unnotableFactorB += -1;
                    if (nodeB.completed) {
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

export function identifyDeletedChildrenIDS(node: TreeNode, tree: TreeStateType) {
    const idsToBeDeleted: string[] = [];

    function deleteSelfAndChildren(node: TreeNode) {
        // leaf nodes
        if (node.childIDS.length == 0) {
            idsToBeDeleted.push(node.id);
            return;
        }

        // iterate every child node
        for (let i = 0; i < node.childIDS.length; i++) {
            deleteSelfAndChildren(tree.get(node.childIDS[i])!);
        }

        idsToBeDeleted.push(node.id);
    }

    deleteSelfAndChildren(node);
    return idsToBeDeleted;
}

export function getDeaths(node: DistinctTreeNode, tree: TreeStateType, mode: DeathType) {

    function switchStatement(subject: Subject) {
        let total = 0;
        switch (mode) {
            case "fullTries":
                total += subject.fullTries;
                break;
            case "resets":
                total += subject.resets;
                break;
            default:
                total += subject.fullTries + subject.resets;
        }
        return total;
    }

    let count = 0;
    if (node.type == "game") {
        node.childIDS.forEach((nodeID) => {
            tree.get(nodeID)?.childIDS.forEach((nodeID) => {
                const subject = tree.get(nodeID) as Subject;
                count += switchStatement(subject);
            })
        })
    }

    else if (node.type == "profile") {
        node.childIDS.forEach((nodeID) => {
            const subject = tree.get(nodeID) as Subject;
            count += switchStatement(subject);
        })
    }

    else {
        count += switchStatement(node);
    }

    return count;

}

export function deleteUndefinedValues(obj: any) {
    Object.keys(obj).forEach((key) => obj[key] === undefined ? delete obj[key] : null);
}