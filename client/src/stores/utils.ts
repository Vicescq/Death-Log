import type { TreeNode, Subject, DistinctTreeNode, Game, Profile, RootNode, Tree } from "../model/TreeNodeModel";
import LocalDB from "../services/LocalDB";
import { assertIsNonNull } from "../utils";
import { nanoid } from "nanoid";

export function validateNodeString(inputText: string, tree: Tree, parentID: string) {
    inputText = inputText.trim();
    if (typeof inputText != "string") {
        throw new Error("Text has to be of type string!");
    }
    if (inputText == "") {
        throw new Error("Name cannot be empty!");
    }
    if (!isNodeNameUnique(tree, parentID, inputText)) {
        throw new Error("Name has to be unique!")
    }
    if (inputText == "...") {
        throw new Error("Please use another name!");
    }

    return inputText;
}

export function sortChildIDS(parentNode: TreeNode, tree: Tree) {
    const sorted = parentNode.childIDS.toSorted((a, b) => {
        const nodeA = tree.get(a);
        const nodeB = tree.get(b);

        assertIsNonNull(nodeA);
        assertIsNonNull(nodeB);

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
    const rootNode: RootNode = {
        type: "ROOT_NODE",
        id: "ROOT_NODE",
        childIDS: [],
        parentID: "NONE",
        name: "",
        completed: false,
        notes: "",
        dateStart: "",
        dateEnd: "",
        dateStartRel: true,
        dateEndRel: true
    };
    return rootNode
}

export function createGame(
    inputText: string,
    tree: Tree
) {
    const id = generateAndValidateID(tree);
    const defaultGame: Game = {
        type: "game",
        id: id,
        childIDS: [],
        parentID: "ROOT_NODE",
        name: inputText,
        completed: false,
        notes: "",
        dateStart: new Date().toISOString(),
        dateEnd: null,
        dateStartRel: true,
        dateEndRel: true // maybe should be null?
    };
    return defaultGame
}

export function createProfile(
    inputText: string,
    parentID: string,
    tree: Tree
) {
    const id = generateAndValidateID(tree);
    const defaultProfile: Profile = {
        type: "profile",
        id: id,
        childIDS: [],
        parentID: parentID,
        name: inputText,
        completed: false,
        notes: "",
        dateStart: new Date().toISOString(),
        dateEnd: null,
        groupings: [],
        dateStartRel: true,
        dateEndRel: true
    };
    return defaultProfile
}

export function createSubject(
    inputText: string,
    parentID: string,
    tree: Tree
) {
    const id = generateAndValidateID(tree);
    const defaultSubject: Subject = {
        type: "subject",
        id: id,
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
        timeSpent: null,
        dateStartRel: true,
        dateEndRel: true
    };
    return defaultSubject
}

export function generateAndValidateID(tree: Tree) {
    let id: string;
    let counter = 0
    do {
        id = nanoid(8)
        counter += 1;
    } while (tree.has(id) && counter <= 100)
    if (counter > 100) {
        throw new Error("ERROR! You somehow generated 100 duplicated IDs of length 8 in a row. Either you messed something in the local db or youre an insanely lucky person! :)")
    }
    return id
}

export async function refreshTree(initTree: (nodes: DistinctTreeNode[]) => void) {
    const nodes = await LocalDB.getNodes();
    initTree(nodes);
}

export function validateProfileGroup(){
    
}