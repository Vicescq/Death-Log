import type { TreeStateType } from "../contexts/treeContext";
import type { Action, ActionType, ActionUpdate } from "../model/Action";
import type { RootNode, DistinctTreeNode, TreeNode, Game, Profile, Subject } from "../model/TreeNodeModel";
import { createShallowCopyMap, deleteUndefinedValues } from "../utils/general";
import { createNodePath, identifyDeletedChildrenIDS, sortChildIDS } from "./treeUtils";
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
        const treeCopy = createShallowCopyMap(tree);
        treeCopy.set(node.id, node);
        const parentNode = treeCopy.get(node.parentID!)!;
        const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
        parentNodeCopy.childIDS.push(node.id);
        parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, treeCopy);
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);
        const actions = TreeContextManager.createActions(node, "add", undefined, parentNodeCopy)
        return { treeCopy, actions }
    }

    static deleteNode(tree: TreeStateType, node: DistinctTreeNode) {
        // first element is reserved to be the updated parent, LAST is central node, rest are children
        const treeCopy = createShallowCopyMap(tree);

        const parentNode = treeCopy.get(node.parentID!)!;
        const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
        parentNodeCopy.childIDS = parentNodeCopy.childIDS.filter((id) => id != node.id);
        const nodeIDSToBeDeleted = identifyDeletedChildrenIDS(node, tree);
        nodeIDSToBeDeleted.forEach((id) => treeCopy.delete(id));
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);

        const actions = TreeContextManager.createActions(node, "delete", nodeIDSToBeDeleted, parentNodeCopy);

        return { treeCopy, actions }
    }

    static updateNode(tree: TreeStateType, node: DistinctTreeNode) {
        const treeCopy = createShallowCopyMap(tree);
        treeCopy.set(node.id, node);
        const parentNode = treeCopy.get(node.parentID!)!
        const parentNodeCopy: TreeNode = { ...parentNode, childIDS: [...parentNode.childIDS] };
        parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, treeCopy);
        treeCopy.set(parentNodeCopy.id, parentNodeCopy);

        const actions = TreeContextManager.createActions(node, "update", undefined, parentNodeCopy);

        return { treeCopy, actions }
    }

    static createActions(node: DistinctTreeNode, actionType: ActionType, nodeIDSToBeDeleted?: string[], updatedParent?: TreeNode) {
        let actions: Action[];
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
        };
        deleteUndefinedValues(overrides);
        return {
            ...defaultSubject,
            ...overrides
        } as Subject
    }
}
