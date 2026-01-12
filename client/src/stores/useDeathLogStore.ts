import { create } from 'zustand'
import type { DistinctTreeNode, Game, Profile, RootNode, Subject, Tree, TreeNode } from '../model/TreeNodeModel';
import * as Utils from './utils';
import * as GenUtils from '../utils';
import LocalDB from '../services/LocalDB';
import type { EditableSubjectField } from '../pages/deathLog/DeathLogFAB';

type DeathLogState = {
    tree: Tree;

    initTree: (nodes: DistinctTreeNode[]) => void;
    addNode: (pageType: "game" | "profile" | "subject", inputText: string, parentID: string, overrides?: EditableSubjectField) => void;
    deleteNode: (node: DistinctTreeNode) => void;
    updateNode: (node: DistinctTreeNode, overrides: DistinctTreeNode) => void;
}

export const useDeathLogStore = create<DeathLogState>((set) => ({
    tree: new Map(),

    initTree: (nodes) => {
        set(() => {
            const rootNode: RootNode = Utils.createRootNode();
            const tree: Tree = new Map();
            tree.set("ROOT_NODE", rootNode);
            nodes.forEach((node) => {
                tree.set(node.id, node);
                if (node.type == "game") {
                    rootNode.childIDS.push(node.id);
                    rootNode.childIDS = Utils.sortChildIDS(rootNode, tree);
                }
            })

            return { tree: tree, root: rootNode }
        })
    },

    addNode: (pageType, inputText, parentID, overrides) => {

        set((state) => {
            const name = Utils.validateNodeString(inputText, state.tree, parentID);
            let node: DistinctTreeNode;
            switch (pageType) {
                case "game":
                    node = Utils.createGame(name, state.tree);
                    break;
                case "profile":
                    node = Utils.createProfile(name, parentID, state.tree);
                    break;
                case "subject":
                    node = Utils.createSubject(name, parentID, state.tree);
                    node = { ...node, ...overrides }
                    break;
            }

            const updatedTree = new Map(state.tree);
            updatedTree.set(node.id, node);

            const parentNode = updatedTree.get(parentID);
            GenUtils.assertIsNonNull(parentNode);
            const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS, node.id] };
            parentNodeCopy.childIDS = Utils.sortChildIDS(parentNodeCopy, updatedTree);

            updatedTree.set(parentID, parentNodeCopy);

            if (parentNodeCopy.id == "ROOT_NODE") {
                LocalDB.addNode(node);
            }
            else {
                GenUtils.assertIsDistinctTreeNode(parentNodeCopy);
                LocalDB.addNode(node, parentNodeCopy);
            }
            LocalDB.incrementCRUDCounter();

            return { tree: updatedTree }
        })
    },

    deleteNode: (node) => {
        set((state) => {
            const updatedTree = new Map(state.tree);
            const nodeIDSToBeDeleted = Utils.identifyDeletedSelfAndChildrenIDS(node, updatedTree);
            nodeIDSToBeDeleted.forEach((id) => updatedTree.delete(id));

            const parentNode = updatedTree.get(node.parentID);
            GenUtils.assertIsNonNull(parentNode);

            switch (parentNode.type) {
                case "ROOT_NODE":
                    GenUtils.assertIsRootNode(parentNode);
                    const rootNodeCopy: RootNode = { ...parentNode, childIDS: parentNode.childIDS.filter((id) => id != node.id) };
                    updatedTree.set(rootNodeCopy.id, rootNodeCopy);
                    LocalDB.deleteNode(nodeIDSToBeDeleted);
                    break;
                case "game":
                    GenUtils.assertIsGame(parentNode);
                    const gameNodeCopy: Game = { ...parentNode, childIDS: parentNode.childIDS.filter((id) => id != node.id) };
                    updatedTree.set(gameNodeCopy.id, gameNodeCopy);
                    LocalDB.deleteNode(nodeIDSToBeDeleted, gameNodeCopy);
                    break;
                case "profile":
                    GenUtils.assertIsProfile(parentNode);
                    const profileNodeCopy: Profile = { ...parentNode, childIDS: parentNode.childIDS.filter((id) => id != node.id) };
                    updatedTree.set(profileNodeCopy.id, profileNodeCopy);
                    LocalDB.deleteNode(nodeIDSToBeDeleted, profileNodeCopy);
                    break;
            }

            LocalDB.incrementCRUDCounter();
            return { tree: updatedTree }
        })
    },

    updateNode: (node, overrides) => {
        /**
         * Updates a node field
         */
        set((state) => {
            const updatedTree = new Map(state.tree);
            let updatedAlready = false;

            if (node.name != overrides.name) {
                Utils.validateNodeString(overrides.name, updatedTree, node.parentID);
            }
            const updatedNode: DistinctTreeNode = { ...node, ...overrides };
            updatedTree.set(updatedNode.id, updatedNode);

            // requires sorting
            if (node.dateStart != overrides.dateStart || node.dateEnd != overrides.dateEnd) {
                const parentNode = updatedTree.get(updatedNode.parentID);
                GenUtils.assertIsNonNull(parentNode);

                const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
                parentNodeCopy.childIDS = Utils.sortChildIDS(parentNodeCopy, updatedTree);
                updatedTree.set(parentNodeCopy.id, parentNodeCopy);

                if (parentNodeCopy.id == "ROOT_NODE") {
                    LocalDB.updateNode(updatedNode);
                }
                else {
                    GenUtils.assertIsDistinctTreeNode(parentNodeCopy);
                    LocalDB.updateNode(updatedNode, parentNodeCopy);
                }
                updatedAlready = true
            }

            updatedAlready ? null : LocalDB.updateNode(updatedNode);
            LocalDB.incrementCRUDCounter();

            return { tree: updatedTree }
        })
    },
})) 