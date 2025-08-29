import { create } from 'zustand'
import type { TreeStateType } from '../../contexts/treeContext'
import type { DistinctTreeNode, Game, Profile, RootNode, Subject, TreeNode } from '../../model/TreeNodeModel';
import type { AICSubjectOverrides } from '../../components/addItemCard/types';
import IndexedDBService from '../../services/IndexedDBService';
import { sortChildIDS, sanitizeTreeNodeEntry, identifyDeletedSelfAndChildrenIDS, createGame, createProfile, createSubject, createRootNode } from './utils';

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
            const updatedNode = { ...node, ...overrides };
            updatedTree.set(updatedNode.id, updatedNode);
            IndexedDBService.updateNode(updatedNode, localStorage.getItem("email")!);

            const parentNode = updatedTree.get(node.parentID)!;
            const parentNodeCopy: TreeNode = { ...parentNode };




            // sorting is required
            if ((node.completed != overrides.completed) || (node.dateStart != overrides.dateStart) || (node.dateEnd != overrides.dateEnd)) {
                parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);
            }

            if (node.type == "subject" && overrides.type == "subject") { // overrides check just for TS inference
                const subject = node as Subject;
                const profileNodeCopy = parentNodeCopy as Profile;

                if (subject.deaths < overrides.deaths) {
                    profileNodeCopy.deathEntries.push({ id: node.id, timestamp: new Date().toISOString() });
                    const gameNode = updatedTree.get(profileNodeCopy.parentID) as Game;

                    // update game
                    const gameNodeCopy: Game = { ...gameNode };
                    gameNodeCopy.totalDeaths++;
                    updatedTree.set(profileNodeCopy.parentID, gameNodeCopy);
                    IndexedDBService.updateNode(gameNodeCopy, localStorage.getItem("email")!);
                }

                else if (subject.deaths > overrides.deaths) {
                    profileNodeCopy.deathEntries.pop();

                    // update game
                    const gameNode = updatedTree.get(profileNodeCopy.parentID) as Game;
                    const gameNodeCopy: Game = { ...gameNode };
                    gameNodeCopy.totalDeaths--;
                    updatedTree.set(profileNodeCopy.parentID, gameNodeCopy);
                    IndexedDBService.updateNode(gameNodeCopy, localStorage.getItem("email")!);
                }

                // update profile
                updatedTree.set(node.parentID, profileNodeCopy);
                IndexedDBService.updateNode(profileNodeCopy, localStorage.getItem("email")!);
            }

            else {
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
            const parentNodeCopy: TreeNode = { ...parentNode!, childIDS: parentNode!.childIDS.filter((id) => id != node.id) };
            parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree)
            updatedTree.set(node.parentID, parentNodeCopy);

            IndexedDBService.deleteNode(nodeIDSToBeDeleted, node, localStorage.getItem("email")!, parentNodeCopy);

            return { tree: updatedTree };
        })
    }
}))