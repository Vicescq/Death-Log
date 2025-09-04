
import type { TreeNode, Subject, DistinctTreeNode, Game, Profile, RootNode, Tree } from "../model/TreeNodeModel";
import { v4 as uuidv4 } from 'uuid';
import { assertIsDistinctTreeNode, assertIsNonNull } from "../utils";

export function sanitizeTreeNodeEntry(inputText: string, tree: Tree, parentID: string) {
    inputText = inputText.trim();
    if (typeof inputText != "string") {
        throw new Error("Text has to be of type string!");
    }
    if (inputText == "") {
        throw new Error("Name cannot be empty!");
    }
    if (inputText.includes("?")) {
        throw new Error("Invalid symbols are found!");
    }
    if (!isNodeNameUnique(tree, parentID, inputText)) {
        throw new Error("Name has to be unique!")
    }

    return inputText;
}

export function sortChildIDS(parentNode: TreeNode, tree: Tree) {
    const sorted = parentNode.childIDS.toSorted((a, b) => {
        const nodeA = tree.get(a);
        const nodeB = tree.get(b);

        assertIsNonNull(nodeA);
        assertIsNonNull(nodeB);
        assertIsDistinctTreeNode(nodeA);
        assertIsDistinctTreeNode(nodeB);

        let result = 0;

        function applyWeights(node: DistinctTreeNode) {
            // non complete-> completed
            let weight = 0;
            if (node.completed) {
                weight = -100;
            }
            else {
                weight = 100;
            }
            return weight;
        }

        const nodeAWeights = applyWeights(nodeA);
        const nodeBWeights = applyWeights(nodeB);
        if (nodeAWeights == nodeBWeights) {
            if (nodeA.completed) {
                assertIsNonNull(nodeA.dateEnd);
                assertIsNonNull(nodeB.dateEnd);
                result = Date.parse(nodeB.dateEnd) - Date.parse(nodeA.dateEnd)
            }
            else {
                result = Date.parse(nodeB.dateStart) - Date.parse(nodeA.dateStart)
            }
        }
        else {
            result = nodeBWeights > nodeAWeights ? 1 : -1;

        }
        return result
    });
    return sorted
}

export function identifyDeletedSelfAndChildrenIDS(node: DistinctTreeNode, tree: Tree) {
    const idsToBeDeleted: string[] = [];

    function deleteSelfAndChildren(node: DistinctTreeNode) {
        // leaf nodes
        if (node.childIDS.length == 0) {
            idsToBeDeleted.push(node.id);
            return;
        }

        // iterate every child node
        for (let i = 0; i < node.childIDS.length; i++) {
            const childNode = tree.get(node.childIDS[i]);
            assertIsNonNull(childNode);
            assertIsDistinctTreeNode(childNode);
            deleteSelfAndChildren(childNode);
        }

        idsToBeDeleted.push(node.id);
    }

    deleteSelfAndChildren(node);
    return idsToBeDeleted;
}

export function isNodeNameUnique(tree: Tree, parentID: string, name: string) {
    const parentNode = tree.get(parentID);
    assertIsNonNull(parentNode);
    const siblingNames = parentNode.childIDS.map((id) => {
        const distinctNode = tree.get(id);
        assertIsNonNull(distinctNode);
        return distinctNode.name;
    })
    return !siblingNames.includes(name);
}

export function createRootNode() {
    const rootNode: RootNode = { type: "ROOT_NODE", id: "ROOT_NODE", childIDS: [], parentID: "NONE", name: "", completed: false, notes: "", dateStart: "", dateEnd: "" };
    return rootNode
}

export function createGame(
    inputText: string,
) {
    const defaultGame: Game = {
        type: "game",
        id: uuidv4(),
        childIDS: [],
        parentID: "ROOT_NODE",
        name: inputText,
        completed: false,
        notes: "",
        dateStart: new Date().toISOString(),
        dateEnd: null,
        totalDeaths: 0
    };
    return defaultGame
}

export function createProfile(
    inputText: string,
    parentID: string,
) {
    const defaultProfile: Profile = {
        type: "profile",
        id: uuidv4(),
        childIDS: [],
        parentID: parentID,
        name: inputText,
        completed: false,
        notes: "",
        dateStart: new Date().toISOString(),
        dateEnd: null,
        milestones: [],
        deathEntries: []
    };
    return defaultProfile
}

export function createSubject(
    inputText: string,
    parentID: string,
) {
    const defaultSubject: Subject = {
        type: "subject",
        id: uuidv4(),
        childIDS: [],
        parentID: parentID,
        name: inputText,
        completed: false,
        notes: "",
        dateStart: new Date().toISOString(),
        dateEnd: null,
        deaths: 0,
        reoccurring: false,
        context: "boss",
        timeSpent: null
    };
    return defaultSubject
}

export function updateProfileDeathEntriesOnSubjectDelete(profile: Profile, deletedSubject: Subject) {
    const targetedIndices: number[] = [];
    for (let i = profile.deathEntries.length - 1; i >= 0; i--) {
        if (profile.deathEntries[i].id == deletedSubject.id) {
            targetedIndices.push(i);
        }
    }
    const updatedDeathEntries = profile.deathEntries.filter((_, i) => {
        return !targetedIndices.includes(i);
    });
    return updatedDeathEntries;
}