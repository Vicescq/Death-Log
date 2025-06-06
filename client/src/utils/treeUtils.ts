import type { TreeStateType } from "../contexts/treeContext";
import type { TreeNode, Subject, TangibleTreeNodeParent, DistinctTreeNode, DeathType } from "../model/TreeNodeModel";

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