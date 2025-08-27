import { create } from 'zustand'
import type { TreeStateType } from '../../contexts/treeContext'
import type { TreeNode } from '../../model/TreeNodeModel';
import TreeContextManager from '../../contexts/managers/TreeContextManager';
import type { AICSubjectOverrides } from '../../components/addItemCard/types';
import { createShallowCopyMap, identifyDeletedSelfAndChildrenIDS, sanitizeTreeNodeEntry, sortChildIDS } from '../../contexts/managers/treeUtils';
import type { ActionAdd, ActionDelete, ActionUpdate } from '../../model/Action';

type TreeState = {
    tree: TreeStateType;
    initTree: (nodes: TreeNode[]) => void;
    addNode: (pageType: "game" | "profile" | "subject", inputText: string, parentID: string, overrides?: AICSubjectOverrides) => void;
    updateNode: (node: TreeNode, overrides: Partial<TreeNode>, parentID: string) => void;
    deleteNodes: (node: TreeNode, parentID: string) => void;
}

export const useTreeStore = create<TreeState>((set) => ({
    tree: new Map(),
    initTree: (nodes) => set(() => ({
        tree: TreeContextManager.initTree(nodes)
    })),
    addNode: (pageType, inputText, parentID, overrides) => {
        set((state) => {
            const name = sanitizeTreeNodeEntry(inputText, state.tree, parentID);
            let node: TreeNode;
            switch (pageType) {
                case "game":
                    node = TreeContextManager.createGame(name);
                    break;
                case "profile":
                    node = TreeContextManager.createProfile(name, parentID);
                    break;
                case "subject":
                    node = TreeContextManager.createSubject(name, parentID);
                    node = { ...node, ...overrides }
                    break;
            }
            const updatedTreeIP = createShallowCopyMap(state.tree);
            updatedTreeIP.set(node.id, node);

            const updatedTree = updateParentNode(updatedTreeIP, node, updatedTreeIP.get(parentID)!, "add");

            // const actionAddSelf = TreeContextManager.createAction(node, "add") as ActionAdd;

            // const { updatedTree, action: actionUpdateParent } = TreeContextManager.updateParentNode(updatedTreeIP, node, tree.get(parentID)!, "add");

            return { tree: updatedTree }
        })
    },
    updateNode: (node, overrides, parentID) => {
        set((state) => {
            const updatedTreeIP = createShallowCopyMap(state.tree);
            const updatedNode = { ...node, ...overrides };
            updatedTreeIP.set(node.id, updatedNode);


            const updatedTree = updateParentNode(updatedTreeIP, node, updatedTreeIP.get(parentID)!, "update");


            // const actionUpdateSelf = TreeContextManager.createAction(updatedNode, "update") as ActionUpdate;

            // const { updatedTree, action: actionUpdateParent } =
            //     TreeContextManager.updateParentNode(
            //         updatedTreeIP,
            //         actionUpdateSelf.targets,
            //         tree.get(parentID)!,
            //         "update",
            //     );

            return { tree: updatedTree };
        })
    },
    deleteNodes: (node, parentID) => {
        set((state) => {
            const updatedTreeIP = createShallowCopyMap(state.tree);
            const nodeIDSToBeDeleted = identifyDeletedSelfAndChildrenIDS(node, state.tree);
            nodeIDSToBeDeleted.forEach((id) => updatedTreeIP.delete(id));

            // const actionDeletedIDs = TreeContextManager.createAction(node, "delete", nodeIDSToBeDeleted) as ActionDelete;

            // const { updatedTree, action: actionUpdateParent } = TreeContextManager.updateParentNode(updatedTreeIP, node, tree.get(parentID)!, "delete");
            const updatedTree = updateParentNode(updatedTreeIP, node, updatedTreeIP.get(parentID)!, "delete");
            return { tree: updatedTree };
        })
    }
}))

function updateParentNode(tree: TreeStateType, node: TreeNode, parentNode: TreeNode, parentNodeModeContext?: "add" | "delete" | "update") {
    const updatedTree = createShallowCopyMap(tree);
    const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
    if (parentNodeModeContext == "add") {
        parentNodeCopy.childIDS.push(node.id);
    }
    else if (parentNodeModeContext == "delete") {
        parentNodeCopy.childIDS = parentNodeCopy.childIDS.filter((id) => id != node.id);
    }
    parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);
    updatedTree.set(parentNodeCopy.id, parentNodeCopy);

    // const action = TreeContextManager.createAction(parentNodeCopy, "update") as ActionUpdate;
    return updatedTree;
}