import type { TreeStateType } from "../contexts/treeContext";
import type { ActionType, ActionUpdate, DistinctAction } from "../model/Action";
import type { RootNode, DistinctTreeNode, TreeNode } from "../model/TreeNodeModel";
import { createRootNode, createShallowCopyMap, identifyDeletedChildrenIDS, sortChildIDS } from "../utils/tree";

export default class TreeContextService {
    constructor() { }

    static initTree(tree: TreeStateType, nodes: DistinctTreeNode[]) {
        const treeCopy = createShallowCopyMap(tree);
        const rootNode: RootNode = createRootNode();
        treeCopy.set(rootNode.id, rootNode);

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
        return treeCopy
    }

    static addNode(tree: TreeStateType, node: DistinctTreeNode) {
        const treeCopy = createShallowCopyMap(tree);
        treeCopy.set(node.id, node);
        const parentNode = treeCopy.get(node.parentID!)!;
        const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
        parentNodeCopy.childIDS.push(node.id);
        parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, treeCopy);
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);
        const actions = TreeContextService.createActions(node, "add", undefined, parentNodeCopy)
        return { treeCopy, actions }
    }

    static deleteNode(tree: TreeStateType, node: DistinctTreeNode) {
        // first element is reserved to be the updated parent, LAST is central node, rest are children
        const treeCopy = createShallowCopyMap(tree);

        const parentNode = treeCopy.get(node.parentID!)!;
        const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
        parentNodeCopy.childIDS = parentNodeCopy.childIDS.filter((id) => id != node.id);
        const nodeIDSToBeDeleted = identifyDeletedChildrenIDS(node, tree);;
        nodeIDSToBeDeleted.forEach((id) => treeCopy.delete(id));
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);

        const actions = TreeContextService.createActions(node, "delete", nodeIDSToBeDeleted, parentNodeCopy);

        return { treeCopy, actions }
    }

    static updateNode(tree: TreeStateType, node: DistinctTreeNode) {
        const treeCopy = createShallowCopyMap(tree);
        treeCopy.set(node.id, node);
        const parentNode = treeCopy.get(node.parentID!)!
        const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
        parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, treeCopy);
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);

        const actions = TreeContextService.createActions(node, "update", undefined, parentNodeCopy);

        return { treeCopy, actions }
    }

    static createActions(node: DistinctTreeNode, actionType: ActionType, nodeIDSToBeDeleted?: string[], updatedParent?: TreeNode) {
        let actions: DistinctAction[];
        if (node.type == "game") {
            switch (actionType) {
                case "add":
                    actions = [{ type: "add", targets: [node] }]
                    break;
                case "delete":
                    actions = [{ type: "delete", targets: nodeIDSToBeDeleted! }]
                    break;
                default:
                    actions = [{ type: "update", targets: [node] }];
            }
        }
        else {
            const distinctUpdatedParent = updatedParent as DistinctTreeNode
            const updatedParentAction: ActionUpdate = { type: "update", targets: [distinctUpdatedParent] };
            switch (actionType) {
                case "add":
                    actions = [{ type: "add", targets: [node] }, updatedParentAction]
                    break;
                case "delete":
                    actions = [{ type: "delete", targets: nodeIDSToBeDeleted! }, updatedParentAction]
                    break;
                default:
                    actions = [{ type: "update", targets: [node] }, updatedParentAction];
            }
        }

        return actions
    }

}
