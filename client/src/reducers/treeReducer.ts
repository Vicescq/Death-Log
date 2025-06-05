import type { TreeStateType } from "../contexts/treeContext";
import type { Action } from "../model/Action";
import type { DistinctTreeNode, RootNode, TreeNode } from "../model/TreeNodeModel";
import { createRootNode, createShallowCopyMap, sortChildIDS } from "../utils/tree";

export default function treeReducer(tree: TreeStateType, action: Action) {
    const treeCopy = createShallowCopyMap(tree);

    function init() {
        const rootNode: RootNode = createRootNode();
        treeCopy.set(rootNode.id, rootNode);
        const nodes = action.targets as DistinctTreeNode[];
        nodes.forEach((node) => {
            treeCopy.set(node.id, node);
            if (node.type == "game") {
                const rootNode = treeCopy.get(node.parentID!) as RootNode;
                const rootNodeCopy: RootNode = { ...rootNode, childIDS: [...rootNode.childIDS] };
                rootNodeCopy.childIDS.push(node.id);
                rootNodeCopy.childIDS = sortChildIDS(rootNodeCopy, treeCopy);
                treeCopy.set(rootNodeCopy.id, rootNodeCopy);
            }
        })
    }

    function addNode() {
        const node = action.targets[0] as TreeNode;
        treeCopy.set(node.id, node);
        const parentNode = treeCopy.get(node.parentID!)!;
        const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
        parentNodeCopy.childIDS.push(node.id);
        parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, treeCopy);
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);
    }

    function deleteNode() {
        // first element is reserved to be the updated parent, LAST is central node, rest are children
        const parentNodeID = action.targets[0] as string;
        const centralNodeID = action.targets[action.targets.length - 1] as string;
        const parentNode = treeCopy.get(parentNodeID)!;
        const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
        parentNodeCopy.childIDS = parentNodeCopy.childIDS.filter((id) => id != centralNodeID);
        const nodeIDSToBeDeleted = action.targets.slice(2) as string[];
        nodeIDSToBeDeleted.forEach((id) => treeCopy.delete(id));
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);
    }

    function updateNode() {
        const node = action.targets[0] as TreeNode;
        treeCopy.set(node.id, node);
        const parentNode = treeCopy.get(node.parentID!)!
        const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
        parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, treeCopy);
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);
    }

    switch (action.type) {

        case "init":
            init();
            return treeCopy

        case "add":
            addNode();
            return treeCopy;

        case "delete":
            deleteNode();
            return treeCopy;

        case "update":
            updateNode();
            return treeCopy

        default:
            throw new Error("DEV ERROR!")
    }

}






