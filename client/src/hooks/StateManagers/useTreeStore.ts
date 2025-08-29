import { create } from 'zustand'
import type { TreeStateType } from '../../contexts/treeContext'
import type { DistinctTreeNode, Game, Profile, RootNode, Subject, TreeNode } from '../../model/TreeNodeModel';
import type { AICSubjectOverrides } from '../../components/addItemCard/types';
import IndexedDBService from '../../services/IndexedDBService';
import { sortChildIDS, sanitizeTreeNodeEntry, identifyDeletedSelfAndChildrenIDS, createGame, createProfile, createSubject, createRootNode, requiresParentUpdate, updateProfileDeathEntriesOnSubjectDelete } from './utils';

type TreeState = {
    tree: TreeStateType;
    initTree: (nodes: TreeNode[]) => void;
    addNode: (pageType: "game" | "profile" | "subject", inputText: string, parentID: string, overrides?: AICSubjectOverrides) => void;
    updateNode: (node: TreeNode, overrides: DistinctTreeNode) => void;
    deleteNodes: (node: TreeNode) => void;
}

export const useTreeStore = create<TreeState>((set) => ({
    tree: new Map(),

    initTree: (nodes) => {
        set(() => {
            const newTree: TreeStateType = new Map();
            const rootNode: RootNode = createRootNode();
            newTree.set(rootNode.id, rootNode);

            nodes.forEach((node) => {
                newTree.set(node.id, node);
                if (node.type == "game") {
                    const rootNode = newTree.get(node.parentID) as RootNode;
                    const rootNodeCopy: RootNode = { ...rootNode, childIDS: [...rootNode.childIDS] };
                    rootNodeCopy.childIDS.push(node.id);
                    rootNodeCopy.childIDS = sortChildIDS(rootNodeCopy, newTree);
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
            const parentNodeCopy: TreeNode = { ...parentNode!, childIDS: [...parentNode!.childIDS, node.id] };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree)
            updatedTree.set(parentID, parentNodeCopy);

            IndexedDBService.addNode(node, localStorage.getItem("email")!, parentNodeCopy);

            return { tree: updatedTree }
        })
    },

    updateNode: (node, overrides) => {
        set((state) => {

            // update current node
            const updatedTree = new Map(state.tree);

            if (node.name != overrides.name) { // card modal state already trims the overrides
                sanitizeTreeNodeEntry(overrides.name, updatedTree, node.parentID);
            }

            const updatedNode = { ...node, ...overrides };
            updatedTree.set(updatedNode.id, updatedNode);
            IndexedDBService.updateNode(updatedNode, localStorage.getItem("email")!);

            // need parent update
            if (requiresParentUpdate(node, overrides)) {
                const parentNode = updatedTree.get(node.parentID)!;
                const parentNodeCopy: TreeNode = { ...parentNode };

                // sorting is required
                if ((node.completed != overrides.completed) || (node.dateStart != overrides.dateStart) || (node.dateEnd != overrides.dateEnd)) {
                    parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);
                }

                if (node.type == "subject" && overrides.type == "subject") { // overrides check just for TS inference

                    if ((node as Subject).deaths < overrides.deaths) {
                        (parentNodeCopy as Profile).deathEntries.push({ id: node.id, timestamp: new Date().toISOString() });
                        const gameNode = updatedTree.get((parentNodeCopy as Profile).parentID) as Game;

                        // update game
                        const gameNodeCopy: Game = { ...gameNode };
                        gameNodeCopy.totalDeaths++;
                        updatedTree.set((parentNodeCopy as Profile).parentID, gameNodeCopy);
                        IndexedDBService.updateNode(gameNodeCopy, localStorage.getItem("email")!);
                    }

                    else if ((node as Subject).deaths > overrides.deaths) {
                        (parentNodeCopy as Profile).deathEntries.pop();

                        // update game
                        const gameNode = updatedTree.get((parentNodeCopy as Profile).parentID) as Game;
                        const gameNodeCopy: Game = { ...gameNode };
                        gameNodeCopy.totalDeaths--;
                        updatedTree.set((parentNodeCopy as Profile).parentID, gameNodeCopy);
                        IndexedDBService.updateNode(gameNodeCopy, localStorage.getItem("email")!);
                    }
                }

                // update parent
                updatedTree.set(parentNodeCopy.id, parentNodeCopy);
                IndexedDBService.updateNode(parentNodeCopy, localStorage.getItem("email")!);

            }

            return { tree: updatedTree };
        })
    },

    deleteNodes: (node) => {
        set((state) => {
            const updatedTree = new Map(state.tree);
            const nodeIDSToBeDeleted = identifyDeletedSelfAndChildrenIDS(node, state.tree);
            nodeIDSToBeDeleted.forEach((id) => updatedTree.delete(id));

            const parentNode = updatedTree.get(node.parentID);
            let parentNodeCopy: TreeNode = { ...parentNode!, childIDS: parentNode!.childIDS.filter((id) => id != node.id) };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree)

            // handle death updates
            switch (parentNodeCopy.type) {
                case "game":
                    (parentNodeCopy as Game).totalDeaths -= (node as Profile).deathEntries.length;
                    break;
                case "profile":
                    parentNodeCopy = { ...parentNodeCopy, deathEntries: [...(parentNodeCopy as Profile).deathEntries] } as Profile;
                    (parentNodeCopy as Profile).deathEntries = updateProfileDeathEntriesOnSubjectDelete(parentNodeCopy as Profile, node as Subject);

                    const game = updatedTree.get(parentNodeCopy.parentID) as Game;
                    const gameNodeCopy = { ...game } as Game;
                    gameNodeCopy.totalDeaths -= (node as Subject).deaths
                    updatedTree.set(gameNodeCopy.id, gameNodeCopy);
                    IndexedDBService.updateNode(gameNodeCopy, localStorage.getItem("email")!); // db update for grandparent

                    break;
                case "subject":
                    break;
                case "ROOT_NODE":
                    break;
            }

            updatedTree.set(node.parentID, parentNodeCopy);
            IndexedDBService.deleteNode(nodeIDSToBeDeleted, node, localStorage.getItem("email")!, parentNodeCopy); // note: this does not capture the logic of updating the grandparent! only the parent.

            return { tree: updatedTree };
        })
    }
}))