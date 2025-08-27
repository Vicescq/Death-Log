import type { TreeStateType } from "../treeContext";
import type { TreeNode, Subject, DistinctTreeNode } from "../../model/TreeNodeModel";

export function sanitizeTreeNodeEntry(inputText: string, tree: TreeStateType, parentID: string) {
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

export function sortChildIDS(parentNode: TreeNode, tree: TreeStateType) {
    const sorted = parentNode.childIDS.toSorted((a, b) => {
        const nodeA = tree.get(a) as DistinctTreeNode;
        const nodeB = tree.get(b) as DistinctTreeNode;

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
            result = nodeA.completed ? Date.parse(nodeB.dateEnd!) - Date.parse(nodeA.dateEnd!) : Date.parse(nodeB.dateStart) - Date.parse(nodeA.dateStart);
        }
        else {
            result = nodeBWeights > nodeAWeights ? 1 : -1;

        }
        return result
    });
    return sorted
}

export function identifyDeletedSelfAndChildrenIDS(node: TreeNode, tree: TreeStateType) {
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

export function getDeaths(node: DistinctTreeNode) {

    // function switchStatement(subject: Subject) {
    //     let total = 0;
    //     total += subject.deaths;
    //     return total;
    // }

    // let count = 0;
    // if (node.type == "game") {
    //     node.childIDS.forEach((nodeID) => {
    //         tree.get(nodeID)?.childIDS.forEach((nodeID) => {
    //             const subject = tree.get(nodeID) as Subject;
    //             count += switchStatement(subject);
    //         })
    //     })
    // }

    // else if (node.type == "profile") {
    //     node.childIDS.forEach((nodeID) => {
    //         const subject = tree.get(nodeID) as Subject;
    //         count += switchStatement(subject);
    //     })
    // }

    // else {
    //     count += switchStatement(node);
    // }
    let x: number = 0;
    if (node.type == "subject"){
        x = node.deaths;
    }

    return x;
}

export function isNodeNameUnique(tree: TreeStateType, parentID: string, name: string) {
    const siblingNames: string[] = tree.get(parentID)!.childIDS.map((id) => {
        const distinctNode = tree.get(id)! as DistinctTreeNode;
        return distinctNode.name;
    })
    return !siblingNames.includes(name);
}
export function createShallowCopyMap(map: TreeStateType) {
    const objLiteralFromTree = Object.fromEntries(map);
    const objLiteralFromTreeShallowCopy = { ...objLiteralFromTree };
    return new Map(Object.entries(objLiteralFromTreeShallowCopy));
}
