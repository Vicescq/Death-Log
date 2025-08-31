import { create } from 'zustand'
import type { DistinctTreeNode, Game, ParentTreeNode, Profile, RootNode, Subject, Tree, TreeNode } from '../../model/TreeNodeModel';
import type { AICSubjectOverrides } from '../../components/addItemCard/types';
import IndexedDBService from '../../services/IndexedDBService';
import { sortChildIDS, sanitizeTreeNodeEntry, identifyDeletedSelfAndChildrenIDS, createGame, createProfile, createSubject, createRootNode, updateProfileDeathEntriesOnSubjectDelete } from './utils';
import { assertIsDistinctTreeNode, assertIsGame, assertIsNonNull, assertIsProfile, assertIsRootNode, assertIsSubject } from '../../utils';

type TreeState = {
    tree: Tree;
    initTree: (nodes: DistinctTreeNode[]) => void;
    addNode: (pageType: "game" | "profile" | "subject", inputText: string, parentID: string, overrides?: AICSubjectOverrides) => void;
    deleteNodes: (node: DistinctTreeNode) => void;
    updateNodeDeaths: (subject: Subject, operation: "add" | "subtract") => void;
    updateNodeCompletion: (node: DistinctTreeNode) => void;
    updateModalEditedNode: (node: DistinctTreeNode, overrides: DistinctTreeNode) => void;
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

            const localStorageRes = localStorage.getItem("email");
            assertIsNonNull(localStorageRes);

            const parentNode = updatedTree.get(parentID);
            assertIsNonNull(parentNode);
            const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS, node.id] };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);

            updatedTree.set(parentID, parentNodeCopy);

            if (parentNodeCopy.id == "ROOT_NODE") {
                IndexedDBService.addNode(node, localStorageRes);
            }
            else {
                assertIsDistinctTreeNode(parentNodeCopy);
                IndexedDBService.addNode(node, localStorageRes, parentNodeCopy);
            }

            return { tree: updatedTree }
        })
    },

    deleteNodes: (node) => {
        set((state) => {
            const updatedTree = new Map(state.tree);
            const nodeIDSToBeDeleted = identifyDeletedSelfAndChildrenIDS(node, updatedTree);
            console.log("DELETED:", nodeIDSToBeDeleted)
            nodeIDSToBeDeleted.forEach((id) => updatedTree.delete(id));

            const localStorageRes = localStorage.getItem("email");
            assertIsNonNull(localStorageRes)

            const parentNode = updatedTree.get(node.parentID);
            assertIsNonNull(parentNode);
            let parentNodeCopy: TreeNode = { ...parentNode, childIDS: parentNode.childIDS.filter((id) => id != node.id) };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);

            // handle death updates
            switch (parentNodeCopy.type) {
                case "ROOT_NODE":
                    updatedTree.set(parentNodeCopy.id, parentNodeCopy);
                    break;

                case "game":
                    assertIsGame(parentNodeCopy);
                    assertIsProfile(node);
                    parentNodeCopy.totalDeaths -= node.deathEntries.length;

                    updatedTree.set(parentNodeCopy.id, parentNodeCopy);
                    break;
                case "profile":

                    assertIsProfile(parentNodeCopy);
                    assertIsSubject(node);
                    parentNodeCopy.deathEntries = updateProfileDeathEntriesOnSubjectDelete(parentNodeCopy, node);

                    const game = updatedTree.get(parentNodeCopy.parentID);
                    assertIsNonNull(game);
                    assertIsGame(game);
                    const gameNodeCopy: Game = { ...game };
                    gameNodeCopy.totalDeaths -= node.deaths;

                    updatedTree.set(parentNodeCopy.id, parentNodeCopy);
                    updatedTree.set(gameNodeCopy.id, gameNodeCopy);
                    break;

                case "subject":
                    throw new Error("DEV ERROR! Its impossible for a subject to be a parent!");
            }

            if (parentNodeCopy.id == "ROOT_NODE") {
                IndexedDBService.deleteNode(nodeIDSToBeDeleted, node, localStorageRes);
            }
            else {
                assertIsDistinctTreeNode(parentNodeCopy);
                IndexedDBService.deleteNode(nodeIDSToBeDeleted, node, localStorageRes, parentNodeCopy);
            }

            return { tree: updatedTree };
        })
    },

    updateNodeDeaths: (subject, operation) => {
        set((state) => {
            const updatedTree = new Map(state.tree);
            let updatedSubject: Subject;

            const localStorageRes = localStorage.getItem("email");
            assertIsNonNull(localStorageRes);

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
            const parentNodeCopy: Profile = { ...parentNode, deathEntries: [...parentNode.deathEntries] };
            operation == "add" ? parentNodeCopy.deathEntries.push({ id: updatedSubject.id, timestamp: new Date().toISOString() }) : parentNodeCopy.deathEntries.pop();

            // grandparent updates
            const grandParentNode = updatedTree.get(parentNodeCopy.parentID);
            assertIsNonNull(grandParentNode);
            assertIsGame(grandParentNode);
            const gameNodeCopy: Game = { ...grandParentNode };
            operation == "add" ? gameNodeCopy.totalDeaths++ : gameNodeCopy.totalDeaths--;

            updatedTree.set(updatedSubject.id, updatedSubject);
            updatedTree.set(parentNodeCopy.id, parentNodeCopy);
            updatedTree.set(gameNodeCopy.id, gameNodeCopy);

            IndexedDBService.updateNodeLineage(updatedSubject, parentNodeCopy, gameNodeCopy, localStorageRes);

            return { tree: updatedTree }
        })
    },

    updateNodeCompletion: (node) => {
        set((state) => {
            const updatedTree = new Map(state.tree);
            const updatedNode: DistinctTreeNode = { ...node, completed: !node.completed };
            updatedNode.dateEnd = updatedNode.completed ? new Date().toISOString() : null;
            updatedTree.set(updatedNode.id, updatedNode);

            const localStorageRes = localStorage.getItem("email");
            assertIsNonNull(localStorageRes);

            const parentNode = updatedTree.get(updatedNode.parentID);
            assertIsNonNull(parentNode);
            const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);


            updatedTree.set(parentNodeCopy.id, parentNodeCopy);

            if (parentNodeCopy.id == "ROOT_NODE") {
                IndexedDBService.updateNodeAndParent(updatedNode, localStorageRes);
            }
            else {
                assertIsDistinctTreeNode(parentNodeCopy);
                IndexedDBService.updateNodeAndParent(updatedNode, localStorageRes, parentNodeCopy);
            }

            return { tree: updatedTree };
        })
    },

    updateModalEditedNode: (node, overrides) => {
        set((state) => {
            const updatedTree = new Map(state.tree);
            let updatedAlready = false;

            const localStorageRes = localStorage.getItem("email");
            assertIsNonNull(localStorageRes);

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
                    IndexedDBService.updateNodeAndParent(updatedNode, localStorageRes);
                }
                else {
                    assertIsDistinctTreeNode(parentNodeCopy);
                    IndexedDBService.updateNodeAndParent(updatedNode, localStorageRes, parentNodeCopy);
                }
                updatedAlready = true
            }

            updatedAlready ? null : IndexedDBService.updateNode(updatedNode, localStorageRes);

            return { tree: updatedTree }
        })
    },

}))