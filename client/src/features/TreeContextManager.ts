import type { TreeStateType } from "../contexts/treeContext";
import type { Action, ActionAdd, ActionDelete, ActionType, ActionUpdate } from "../model/Action";
import type { RootNode, DistinctTreeNode, TreeNode, Game, Profile, Subject } from "../model/TreeNodeModel";
import { createShallowCopyMap, deleteUndefinedValues } from "../utils/general";
import { createNodePath, identifyDeletedSelfAndChildrenIDS, sortChildIDS } from "./treeUtils";
import { v4 as uuidv4 } from 'uuid';

export default class TreeContextManager {
    constructor() { }

    static initTree(nodes: DistinctTreeNode[]) {
        const newTree: TreeStateType = new Map();
        const rootNode: RootNode = TreeContextManager.createRootNode();
        newTree.set(rootNode.id, rootNode);

        nodes.forEach((node) => {
            newTree.set(node.id, node);
            if (node.type == "game") {
                const rootNode = newTree.get(node.parentID!) as RootNode;
                const rootNodeCopy: RootNode = { ...rootNode, childIDS: [...rootNode.childIDS] };
                rootNodeCopy.childIDS.push(node.id);
                rootNodeCopy.childIDS = sortChildIDS(rootNodeCopy, newTree);
                newTree.set(rootNodeCopy.id, rootNodeCopy);
            }
        })

        return newTree
    }

    static addNode(tree: TreeStateType, node: DistinctTreeNode) {
        const updatedTree = createShallowCopyMap(tree);
        updatedTree.set(node.id, node);
        const action = TreeContextManager.createAction(node, "add") as ActionAdd;
        return { updatedTree, action }
    }

    static deleteNode(tree: TreeStateType, node: DistinctTreeNode) {
        const updatedTree = createShallowCopyMap(tree);
        const nodeIDSToBeDeleted = identifyDeletedSelfAndChildrenIDS(node, tree);
        nodeIDSToBeDeleted.forEach((id) => updatedTree.delete(id));
        const action = TreeContextManager.createAction(node, "delete", nodeIDSToBeDeleted) as ActionDelete;
        return { updatedTree, action }
    }

    static updateNode(tree: TreeStateType, node: DistinctTreeNode) {
        const updatedTree = createShallowCopyMap(tree);
        updatedTree.set(node.id, node);
        const action = TreeContextManager.createAction(node, "update") as ActionUpdate;
        return { updatedTree, action }
    }

    static createAction(node: DistinctTreeNode, actionType: ActionType, nodeIDSToBeDeleted?: string[]) {
        let action: Action;
        if (node.type == "game") {
            switch (actionType) {
                case "add":
                    action = { type: "add", targets: node };
                    break;
                case "delete":
                    action = { type: "delete", targets: nodeIDSToBeDeleted! };
                    break;
                default:
                    action = { type: "update", targets: node };
            }
        }
        else {
            switch (actionType) {
                case "add":
                    action = { type: "add", targets: node }
                    break;
                case "delete":
                    action = { type: "delete", targets: nodeIDSToBeDeleted! }
                    break;
                default:
                    action = { type: "update", targets: node };
            }
        }

        return action
    }

    static createRootNode() {
        const rootNode: RootNode = { type: "ROOT_NODE", id: "ROOT_NODE", childIDS: [], parentID: null };
        return rootNode
    }

    static createGame(
        inputText: string,
        tree: TreeStateType,
        overrides: Partial<Game>,
    ) {
        const path = createNodePath(inputText, "ROOT_NODE", tree);
        const defaultGame: Game = {
            type: "game",
            id: uuidv4(),
            childIDS: [],
            parentID: "ROOT_NODE",
            name: inputText,
            completed: false,
            notes: null,
            dateStart: new Date().toISOString(),
            dateEnd: null,
            path: path,
            dateStartR: true,
            dateEndR: true,
        };
        deleteUndefinedValues(overrides);
        return {
            ...defaultGame,
            ...overrides
        } as Game
    }

    static createProfile(
        inputText: string,
        tree: TreeStateType,
        parentID: string,
        overrides: Partial<Profile>,
    ) {
        const path = createNodePath(inputText, parentID, tree);
        const defaultProfile: Profile = {
            type: "profile",
            id: uuidv4(),
            childIDS: [],
            parentID: parentID,
            name: inputText,
            completed: false,
            notes: null,
            dateStart: new Date().toISOString(),
            dateEnd: null,
            path: path,
            dateStartR: true,
            dateEndR: true,
        };
        deleteUndefinedValues(overrides);
        return {
            ...defaultProfile,
            ...overrides
        } as Profile
    }

    static createSubject(
        inputText: string,
        parentID: string,
        overrides: Partial<Subject>,
    ) {
        const defaultSubject: Subject = {
            type: "subject",
            id: uuidv4(),
            childIDS: [],
            parentID: parentID,
            name: inputText,
            completed: false,
            notes: null,
            dateStart: new Date().toISOString(),
            dateEnd: null,
            notable: true,
            fullTries: 0,
            resets: 0,
            boss: true,
            location: false,
            other: false,
            dateStartR: true,
            dateEndR: true,
            composite: false,
            compositeRelations: [],
            reoccurring: false,
        };
        deleteUndefinedValues(overrides);
        return {
            ...defaultSubject,
            ...overrides
        } as Subject
    }

    static updateNodeCompletion(node: DistinctTreeNode, newStatus: boolean, tree: TreeStateType) {
        const dateEnd = newStatus ? new Date().toISOString() : null;
        const updatedNode: DistinctTreeNode = {
            ...node,
            completed: newStatus,
            dateEnd: dateEnd,
        };
        const { updatedTree, action } = TreeContextManager.updateNode(
            tree,
            updatedNode,
        );
        return { updatedTree, action };
    }

    static updateNodeParent(node: DistinctTreeNode, tree: TreeStateType, mode: "add" | "delete" | "update") {
        const updatedTree = createShallowCopyMap(tree);
        const parentNode = updatedTree.get(node.parentID!)!;
        const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };

        if (mode == "add") {
            parentNodeCopy.childIDS.push(node.id);
        }
        else if (mode == "delete"){
            parentNodeCopy.childIDS = parentNodeCopy.childIDS.filter((id) => id != node.id);
        }

        parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);
        updatedTree.set(parentNodeCopy.id, parentNodeCopy);
        const parentNodeCopyDistinct = parentNodeCopy as DistinctTreeNode;
        const action = TreeContextManager.createAction(parentNodeCopyDistinct, "update") as ActionUpdate;
        return { updatedTree, action };
    }
}