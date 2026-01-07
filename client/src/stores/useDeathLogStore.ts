import { create } from 'zustand'
import type { DistinctTreeNode, Game, Profile, RootNode, Subject, Tree, TreeNode } from '../model/TreeNodeModel';
import { sortChildIDS, validateNodeString, identifyDeletedSelfAndChildrenIDS, createGame, createProfile, createSubject, createRootNode } from './utils';
import { assertIsDistinctTreeNode, assertIsGame, assertIsGameOrProfile, assertIsNonNull, assertIsProfile, assertIsRootNode } from '../utils';
import LocalDB from '../services/LocalDB';
import type { EditableSubjectField } from '../pages/deathLog/DeathLogFAB';

type DeathLogState = {
    tree: Tree;

    initTree: (nodes: DistinctTreeNode[]) => void;
    addNode: (pageType: "game" | "profile" | "subject", inputText: string, parentID: string, overrides?: EditableSubjectField) => void;
    deleteGame: (node: Game) => void;
    deleteProfile: (node: Profile) => void;
    deleteSubject: (node: Subject) => void;
    updateNodeDeaths: (subject: Subject, operation: "add" | "subtract") => void;
    updateNodeCompletion: (node: DistinctTreeNode) => void;
    updateModalEditedNode: (node: DistinctTreeNode, overrides: DistinctTreeNode) => void;
    updateNodeTimeSpent: (node: Subject, timeSpent: string | null) => void;
}

export const useDeathLogStore = create<DeathLogState>((set) => ({
    tree: new Map(),

    initTree: (nodes) => {
        set(() => {
            const rootNode: RootNode = createRootNode();
            const tree: Tree = new Map();
            tree.set("ROOT_NODE", rootNode);
            nodes.forEach((node) => {
                tree.set(node.id, node);
                if (node.type == "game") {
                    rootNode.childIDS.push(node.id);
                    rootNode.childIDS = sortChildIDS(rootNode, tree);
                }
            })

            return { tree: tree, root: rootNode }
        })
    },

    addNode: (pageType, inputText, parentID, overrides) => {

        set((state) => {
            const name = validateNodeString(inputText, state.tree, parentID);
            let node: DistinctTreeNode;
            switch (pageType) {
                case "game":
                    node = createGame(name, state.tree);
                    break;
                case "profile":
                    node = createProfile(name, parentID, state.tree);
                    break;
                case "subject":
                    node = createSubject(name, parentID, state.tree);
                    node = { ...node, ...overrides }
                    break;
            }

            const updatedTree = new Map(state.tree);
            updatedTree.set(node.id, node);

            const parentNode = updatedTree.get(parentID);
            assertIsNonNull(parentNode);
            const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS, node.id] };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);

            updatedTree.set(parentID, parentNodeCopy);

            if (parentNodeCopy.id == "ROOT_NODE") {
                LocalDB.addNode(node);
            }
            else {
                assertIsDistinctTreeNode(parentNodeCopy);
                LocalDB.addNode(node, parentNodeCopy);
            }
            LocalDB.incrementCRUDCounter();

            return { tree: updatedTree }
        })
    },

    deleteGame: (node) => {
        set((state) => {
            const updatedTree = new Map(state.tree);
            const nodeIDSToBeDeleted = identifyDeletedSelfAndChildrenIDS(node, updatedTree);
            nodeIDSToBeDeleted.forEach((id) => updatedTree.delete(id));

            const parentNode = updatedTree.get(node.parentID);
            assertIsNonNull(parentNode);
            assertIsRootNode(parentNode)
            const parentNodeCopy: RootNode = { ...parentNode, childIDS: parentNode.childIDS.filter((id) => id != node.id) };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);

            updatedTree.set(parentNodeCopy.id, parentNodeCopy);

            LocalDB.deleteGame(nodeIDSToBeDeleted);
            LocalDB.incrementCRUDCounter();

            return { tree: updatedTree }
        })
    },

    deleteProfile(node) {
        set((state) => {
            const updatedTree = new Map(state.tree);
            const nodeIDSToBeDeleted = identifyDeletedSelfAndChildrenIDS(node, updatedTree);
            nodeIDSToBeDeleted.forEach((id) => updatedTree.delete(id));

            const parentNode = updatedTree.get(node.parentID);
            assertIsNonNull(parentNode);
            assertIsGame(parentNode);
            const parentNodeCopy: Game = { ...parentNode, childIDS: parentNode.childIDS.filter((id) => id != node.id) };

            updatedTree.set(parentNodeCopy.id, parentNodeCopy);
            LocalDB.deleteProfile(nodeIDSToBeDeleted, parentNodeCopy);
            LocalDB.incrementCRUDCounter();
            return { tree: updatedTree }
        })
    },

    deleteSubject(node) {
        set((state) => {
            const updatedTree = new Map(state.tree);
            const nodeIDSToBeDeleted = identifyDeletedSelfAndChildrenIDS(node, updatedTree);
            nodeIDSToBeDeleted.forEach((id) => updatedTree.delete(id));

            const profileNode = updatedTree.get(node.parentID);
            assertIsNonNull(profileNode);
            assertIsProfile(profileNode)
            const profileNodeCopy: Profile = { ...profileNode, childIDS: profileNode.childIDS.filter((id) => id != node.id) };

            const game = updatedTree.get(profileNodeCopy.parentID);
            assertIsNonNull(game);
            assertIsGame(game);
            const gameNodeCopy: Game = { ...game };

            updatedTree.set(profileNodeCopy.id, profileNodeCopy);
            updatedTree.set(gameNodeCopy.id, gameNodeCopy);
            LocalDB.deleteSubject(nodeIDSToBeDeleted, gameNodeCopy, profileNodeCopy);
            LocalDB.incrementCRUDCounter();
            return { tree: updatedTree }
        })
    },

    updateNodeDeaths: (subject, operation) => {
        /**
         * Updates node deaths
         */
        set((state) => {
            const updatedTree = new Map(state.tree);
            let updatedSubject: Subject;

            // card already verifies negative values
            if (operation == "add") {
                updatedSubject = { ...subject, deaths: subject.deaths + 1 };
            }
            else {
                updatedSubject = { ...subject, deaths: subject.deaths - 1 };
            }

            updatedTree.set(updatedSubject.id, updatedSubject);
            LocalDB.updateNode(updatedSubject);
            LocalDB.incrementCRUDCounter();

            return { tree: updatedTree }
        })
    },

    updateNodeCompletion: (node) => {
        /**
         * Updates node completion and implictly updates the subject's direct non-rootNode parent
         */
        set((state) => {
            const updatedTree = new Map(state.tree);
            const updatedNode: DistinctTreeNode = { ...node, completed: !node.completed };
            updatedNode.dateEnd = updatedNode.completed ? new Date().toISOString() : null;
            updatedTree.set(updatedNode.id, updatedNode);

            const parentNode = updatedTree.get(updatedNode.parentID);
            assertIsNonNull(parentNode);
            const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);


            updatedTree.set(parentNodeCopy.id, parentNodeCopy);

            if (parentNodeCopy.id == "ROOT_NODE") {
                LocalDB.updateNodeAndParent(updatedNode);
            }
            else {
                assertIsDistinctTreeNode(parentNodeCopy);
                LocalDB.updateNodeAndParent(updatedNode, parentNodeCopy);
            }
            LocalDB.incrementCRUDCounter();

            return { tree: updatedTree };
        })
    },

    updateModalEditedNode: (node, overrides) => {
        /**
         * Updates node with modal edits and in certain cases, implictly updates the subject's direct non-rootNode parent
         */
        set((state) => {
            const updatedTree = new Map(state.tree);
            let updatedAlready = false;

            if (node.name != overrides.name) { // card modal state already trims the overrides
                validateNodeString(overrides.name, updatedTree, node.parentID);
            }
            const updatedNode: DistinctTreeNode = { ...node, ...overrides };
            updatedTree.set(updatedNode.id, updatedNode);

            // requires sorting
            if (node.dateStart != overrides.dateStart || node.dateEnd != overrides.dateEnd) {
                const parentNode = updatedTree.get(updatedNode.parentID);
                assertIsNonNull(parentNode);

                const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
                parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);
                updatedTree.set(parentNodeCopy.id, parentNodeCopy);

                if (parentNodeCopy.id == "ROOT_NODE") {
                    LocalDB.updateNodeAndParent(updatedNode);
                }
                else {
                    assertIsDistinctTreeNode(parentNodeCopy);
                    LocalDB.updateNodeAndParent(updatedNode, parentNodeCopy);
                }
                updatedAlready = true
            }

            updatedAlready ? null : LocalDB.updateNode(updatedNode);
            LocalDB.incrementCRUDCounter();

            return { tree: updatedTree }
        })
    },

    updateNodeTimeSpent: (node, timeSpent) => {
        // set((state) => {
        //     const updatedTree = new Map(state.tree);
        //     const updatedNode: Subject = { ...node, timeSpent: timeSpent }
        //     updatedTree.set(updatedNode.id, updatedNode);
        //     LocalDB.incrementCRUDCounter();
        //     return { tree: updatedTree }
        // })
    },



})) 