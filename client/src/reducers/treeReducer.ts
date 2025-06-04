import type { TreeStateType } from "../contexts/treeContext";
import type Action from "../model/Action";
import RootNode from "../model/RootNode";
import type TreeNode from "../model/TreeNode";
import { createNewChildIDArrayReference, createShallowCopyMap, sortChildIDS } from "../utils/tree";


export default function treeReducer(tree: TreeStateType, action: Action) {
    const treeCopy = createShallowCopyMap(tree);

    function addNodes() {
        const nodes = action.targets
        nodes.forEach((node) => {
            treeCopy.set(node.id, node);
            const parentNode = treeCopy.get(node.parentID!)!

            // if node not in db already
            if (!parentNode.childIDS.includes(node.id)) {
                const parentNodeCopy = createNewChildIDArrayReference(parentNode);
                parentNodeCopy.childIDS.push(node.id);
                parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, treeCopy);
                treeCopy.set(parentNodeCopy.id, parentNodeCopy);
            }
        })
    }

    function deleteNodes() {
        const node = action.targets[0];
        const nodesDeleted: TreeNode[] = [];
        if (!(node instanceof RootNode)) {

            function deleteSelfAndChildren(node: TreeNode) {

                // leaf nodes
                if (node.childIDS.length == 0) {
                    nodesDeleted.push(treeCopy.get(node.id)!);
                    treeCopy.delete(node.id);
                    return;
                }

                // iterate every child node
                for (let i = 0; i < node.childIDS.length; i++) {
                    deleteSelfAndChildren(treeCopy.get(node.childIDS[i])!);
                }

                // deleting current node
                nodesDeleted.push(treeCopy.get(node.id)!);
                treeCopy.delete(node.id);
            }

            const parentNode = treeCopy.get(node.parentID!)!;
            const parentNodeCopy = createNewChildIDArrayReference(parentNode);
            const targetIndex = parentNode?.childIDS.indexOf(node.id)!;
            parentNodeCopy.childIDS.splice(targetIndex, 1);
            treeCopy.set(parentNodeCopy.id, parentNodeCopy);
            deleteSelfAndChildren(node);

            return nodesDeleted;
        }
    }

    function updateNode() {
        const updatedNode = action.targets[0];
        treeCopy.set(updatedNode.id, updatedNode);
        const parentNode = treeCopy.get(updatedNode.parentID!)!
        const parentNodeCopy = createNewChildIDArrayReference(parentNode);
        parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, treeCopy);
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);
    }

    switch (action.type) {

        case "init":
            const rootNode = new RootNode();
            console.log(rootNode, "ROOOOOOT")
            treeCopy.set(rootNode.id, rootNode);
            addNodes();
            return treeCopy

        case "add":
            addNodes();
            return treeCopy;

        case "delete":
            deleteNodes();
            return treeCopy;

        case "update":
            updateNode();
            return treeCopy

        default:
            throw new Error("DEV ERROR!")
    }
}