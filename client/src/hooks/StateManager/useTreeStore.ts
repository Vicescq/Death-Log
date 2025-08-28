import { create } from 'zustand'
import type { TreeStateType } from '../../contexts/treeContext'
import type { DistinctTreeNode, RootNode, TreeNode } from '../../model/TreeNodeModel';
import TreeContextManager from '../../contexts/managers/TreeContextManager';
import type { AICSubjectOverrides } from '../../components/addItemCard/types';
import { identifyDeletedSelfAndChildrenIDS, sanitizeTreeNodeEntry, sortChildIDS } from '../../contexts/managers/treeUtils';

type TreeState = {
    tree: TreeStateType;
    initTree: (nodes: TreeNode[]) => void;
    addNode: (pageType: "game" | "profile" | "subject", inputText: string, parentID: string, overrides?: AICSubjectOverrides) => void;
    updateNode: (node: TreeNode, overrides: Partial<DistinctTreeNode>, parentID: string) => void;
    deleteNodes: (node: TreeNode, parentID: string) => void;
}

export const useTreeStore = create<TreeState>((set) => ({
    tree: new Map(),
    initTree: (nodes) => {
        set((state) => {
            const newTree: TreeStateType = new Map();
            const rootNode: RootNode = TreeContextManager.createRootNode();
            newTree.set(rootNode.id, rootNode);

            nodes.forEach((node) => {
                newTree.set(node.id, node);
                if (node.type == "game") {
                    const rootNode = newTree.get(node.parentID!) as RootNode;
                    const rootNodeCopy: RootNode = { ...rootNode, childIDS: [...rootNode.childIDS] };
                    rootNodeCopy.childIDS.push(node.id);
                    // rootNodeCopy.childIDS = sortChildIDS(rootNodeCopy, newTree);
                    newTree.set(rootNodeCopy.id, rootNodeCopy);
                }
            })
            return { tree: newTree }
        })
    },

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

            const updatedTree = new Map(state.tree);
            updatedTree.set(node.id, node);

            const parentNode = updatedTree.get(parentID);
            const parentNodeCopy: TreeNode = { ...parentNode!, childIDS: [...parentNode!.childIDS, node.id] };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree)
            updatedTree.set(parentID, parentNodeCopy);

            return { tree: updatedTree }
        })
    },

    updateNode: (node, overrides, parentID) => {
        set((state) => {
            const updatedTree = new Map(state.tree);
            const updatedNode = { ...node, ...overrides };
            updatedTree.set(updatedNode.id, updatedNode);

            // const parentNode = updatedTree.get(parentID);
            // const parentNodeCopy: TreeNode = { ...parentNode! };
            // parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);
            // updatedTree.set(parentID, parentNodeCopy);

            return { tree: updatedTree };
        })
    },
    deleteNodes: (node, parentID) => {
        set((state) => {
            const updatedTree = new Map(state.tree);
            const nodeIDSToBeDeleted = identifyDeletedSelfAndChildrenIDS(node, state.tree);
            nodeIDSToBeDeleted.forEach((id) => updatedTree.delete(id));

            const parentNode = updatedTree.get(parentID);
            const parentNodeCopy: TreeNode = { ...parentNode!, childIDS: parentNode!.childIDS.filter((id) => id != node.id) };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree)
            updatedTree.set(parentID, parentNodeCopy);

            return { tree: updatedTree };
        })
    }
}))