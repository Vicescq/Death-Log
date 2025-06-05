import type { TreeStateType } from "../contexts/treeContext";
import RootNode from "../model/RootNode";
import type TreeNode from "../model/TreeNodeModel";
import { createNewChildIDArrayReference, createShallowCopyMap, sortChildIDS } from "../utils/tree";

type TreeReducerActionType = "init" | "add" | "delete" | "update";

export type TreeReducerAction = {
    type: TreeReducerActionType,
    payload: (TreeNode | string)[];
}

export default function treeReducer(tree: TreeStateType, action: TreeReducerAction) {
    const treeCopy = createShallowCopyMap(tree);

    function init() {
        const rootNode = new RootNode();
        treeCopy.set(rootNode.id, rootNode);
        const nodes = action.payload as TreeNode[];
        nodes.forEach((node) => {
            treeCopy.set(node.id, node);
            if (node.type == "game") {
                const rootNode = treeCopy.get(node.parentID!) as RootNode;
                const rootNodeCopy = createNewChildIDArrayReference(rootNode);
                rootNodeCopy.childIDS.push(node.id);
                rootNodeCopy.childIDS = sortChildIDS(rootNodeCopy, treeCopy);
                treeCopy.set(rootNodeCopy.id, rootNodeCopy);
            }
        })
    }

    function addNode() {
        const node = action.payload[0] as TreeNode;
        treeCopy.set(node.id, node);
        const parentNode = treeCopy.get(node.parentID!)!;
        const parentNodeCopy = createNewChildIDArrayReference(parentNode);
        parentNodeCopy.childIDS.push(node.id);
        parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, treeCopy);
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);
    }

    function deleteNode() {
        // first element is reserved to be the updated parent, LAST is central node, rest are children
        const parentNodeID = action.payload[0] as string;
        const centralNodeID = action.payload[action.payload.length-1] as string;
        const parentNode = treeCopy.get(parentNodeID)!;
        const parentNodeCopy = createNewChildIDArrayReference(parentNode);
        parentNodeCopy.childIDS = parentNodeCopy.childIDS.filter((id) => id != centralNodeID);
        const nodeIDSToBeDeleted = action.payload.slice(2) as string[];
        nodeIDSToBeDeleted.forEach((id) => treeCopy.delete(id));
        treeCopy.set(parentNodeID, parentNodeCopy);
    }

    function updateNode() {
        const node = action.payload[0] as TreeNode;
        treeCopy.set(node.id, node);
        const parentNode = treeCopy.get(node.parentID!)!
        const parentNodeCopy = createNewChildIDArrayReference(parentNode);
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






