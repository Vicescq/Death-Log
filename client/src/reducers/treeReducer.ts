import type { TreeStateType } from "../contexts/treeContext";
import type Action from "../model/Action";
import RootNode from "../model/RootNode";
import Subject from "../model/Subject";
import type TreeNode from "../model/TreeNode";
import { createShallowCopyMap, sortChildIDS } from "../utils/tree";


export default function treeReducer(tree: TreeStateType, action: Action) {
    const treeCopy = createShallowCopyMap(tree);

    function addNodes() {
        const nodes = action.targets
        nodes.forEach((node) => {
            treeCopy.set(node.id, node);
            const parentNode = treeCopy.get(node.parentID!)!

            // if node not in db already
            if (!parentNode.childIDS.includes(node.id)) {
                parentNode.childIDS.push(node.id);
            }

            parentNode.childIDS = sortChildIDS(parentNode, treeCopy);
        })
    }

    function deleteNodes(node: TreeNode) {
        const nodesDeleted: TreeNode[] = [];
        if (!(node instanceof RootNode)) {

            function deleteSelfAndChild(node: TreeNode) {

                // leaf nodes
                if (node.childIDS.length == 0) {
                    nodesDeleted.push(treeCopy.get(node.id)!);
                    treeCopy.delete(node.id);
                    return;
                }

                // iterate every child node
                for (let i = 0; i < node.childIDS.length; i++) {
                    deleteSelfAndChild(treeCopy.get(node.childIDS[i])!);
                }

                // deleting current node
                nodesDeleted.push(tree.get(node.id)!);
                treeCopy.delete(node.id);
            }

            const parentNode = treeCopy.get(node.parentID!);
            const targetIndex = parentNode?.childIDS.indexOf(node.id)!;
            parentNode?.childIDS.splice(targetIndex, 1);
            deleteSelfAndChild(node);

            return nodesDeleted;
        }
    }

    switch (action.type) {

        case "init":
            const rootNode = new RootNode();
            treeCopy.set(rootNode.id, rootNode);
            addNodes();
            return treeCopy

        case "add":
            addNodes();
            return treeCopy;

        case "delete":
            const node = action.targets[0];
            deleteNodes(node);
            return treeCopy;


        default:
            throw new Error("DEV ERROR!")
    }
}