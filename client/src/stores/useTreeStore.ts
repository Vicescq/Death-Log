import { create } from 'zustand'
import type { DistinctTreeNode, Game, ParentTreeNode, Profile, RootNode, Subject, Tree, TreeNode } from '../model/TreeNodeModel';
import type { AICSubjectOverrides } from '../components/addItemCard/types';
import { sortChildIDS, sanitizeTreeNodeEntry, identifyDeletedSelfAndChildrenIDS, createGame, createProfile, createSubject, createRootNode, updateProfileDeathEntriesOnSubjectDelete } from './utils';
import { assertIsDistinctTreeNode, assertIsGame, assertIsGameOrProfile, assertIsNonNull, assertIsProfile, assertIsRootNode } from '../utils';
import Backend from '../services/Backend';
import type { DeleteGameEvent } from '../model/EventModel';
import LocalDB from '../services/LocalDB';

type TreeState = {
    tree: Tree;
    initTree: (nodes: DistinctTreeNode[]) => void;
    addNode: (pageType: "game" | "profile" | "subject", inputText: string, parentID: string, overrides?: AICSubjectOverrides) => void;
    deleteGame: (node: Game) => void;
    deleteProfile: (node: Profile) => void;
    deleteSubject: (node: Subject) => void;
    updateNodeDeaths: (subject: Subject, operation: "add" | "subtract") => void;
    updateNodeCompletion: (node: DistinctTreeNode) => void;
    updateModalEditedNode: (node: DistinctTreeNode, overrides: DistinctTreeNode) => void;
    updateNodeTimeSpent: (node: Subject, timeSpent: string | null) => void;
}

export const useTreeStore = create<TreeState>((set) => ({
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
            const name = sanitizeTreeNodeEntry(inputText, state.tree, parentID);
            let node: DistinctTreeNode;
            switch (pageType) {
                case "game":
                    node = createGame(name);
                    break;
                case "profile":
                    node = createProfile(name, parentID);
                    break;
                case "subject":
                    node = createSubject(name, parentID);
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

            // const delGameEvent: DeleteGameEvent = { data: node.id, subtype: "game", type: 'delete', sideEffects: { deletedLineage: nodeIDSToBeDeleted.slice(1) } };
            LocalDB.deleteGame(nodeIDSToBeDeleted);

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
            parentNodeCopy.totalDeaths -= node.deathEntries.length;

            updatedTree.set(parentNodeCopy.id, parentNodeCopy);
            LocalDB.deleteProfile(nodeIDSToBeDeleted, parentNodeCopy);
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

            profileNodeCopy.deathEntries = updateProfileDeathEntriesOnSubjectDelete(profileNodeCopy, node);

            const game = updatedTree.get(profileNodeCopy.parentID);
            assertIsNonNull(game);
            assertIsGame(game);
            const gameNodeCopy: Game = { ...game };
            gameNodeCopy.totalDeaths -= node.deaths;

            updatedTree.set(profileNodeCopy.id, profileNodeCopy);
            updatedTree.set(gameNodeCopy.id, gameNodeCopy);
            LocalDB.deleteSubject(nodeIDSToBeDeleted, gameNodeCopy, profileNodeCopy, LocalDB.getUserEmail());
            return { tree: updatedTree }
        })
    },

    updateNodeDeaths: (subject, operation) => {
        /**
         * Updates node deaths and implictly updates the subject's lineage with the updated count
         */
        set((state) => {
            const updatedTree = new Map(state.tree);
            let updatedSubject: Subject;

            // const localStorageRes = localStorage.getItem("email");
            // assertIsNonNull(localStorageRes);

            // card already verifies negative values
            if (operation == "add") {
                updatedSubject = { ...subject, deaths: subject.deaths + 1 };
            }
            else {
                updatedSubject = { ...subject, deaths: subject.deaths - 1 };
            }

            const parentNode = updatedTree.get(updatedSubject.parentID);
            assertIsNonNull(parentNode);
            assertIsProfile(parentNode);
            const profileNodeCopy: Profile = { ...parentNode, deathEntries: [...parentNode.deathEntries] };
            operation == "add" ? profileNodeCopy.deathEntries.push({ id: updatedSubject.id, timestamp: new Date().toISOString() }) : profileNodeCopy.deathEntries.pop();

            // grandparent updates
            const grandParentNode = updatedTree.get(profileNodeCopy.parentID);
            assertIsNonNull(grandParentNode);
            assertIsGame(grandParentNode);
            const gameNodeCopy: Game = { ...grandParentNode };
            operation == "add" ? gameNodeCopy.totalDeaths++ : gameNodeCopy.totalDeaths--;

            updatedTree.set(updatedSubject.id, updatedSubject);
            updatedTree.set(profileNodeCopy.id, profileNodeCopy);
            updatedTree.set(gameNodeCopy.id, gameNodeCopy);

            LocalDB.updateNodeLineage(updatedSubject, profileNodeCopy, gameNodeCopy);

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

            // const localStorageRes = localStorage.getItem("email");
            // assertIsNonNull(localStorageRes);

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

            // const localStorageRes = localStorage.getItem("email");
            // assertIsNonNull(localStorageRes);

            if (node.name != overrides.name) { // card modal state already trims the overrides
                sanitizeTreeNodeEntry(overrides.name, updatedTree, node.parentID);
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

            return { tree: updatedTree }
        })
    },

    updateNodeTimeSpent: (node, timeSpent) => {
        set((state) => {
            const updatedTree = new Map(state.tree);
            const updatedNode: Subject = { ...node, timeSpent: timeSpent }
            updatedTree.set(updatedNode.id, updatedNode);
            return { tree: updatedTree }
        })
    },

}))