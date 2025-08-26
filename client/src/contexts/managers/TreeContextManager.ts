import type { TreeStateType } from "../treeContext";
import type { Action, ActionAdd, ActionDelete, ActionType, ActionUpdate } from "../../model/Action";
import type { RootNode, DistinctTreeNode, TreeNode, Game, Profile, Subject, TreeNodeType } from "../../model/TreeNodeModel";
import { createShallowCopyMap } from "./treeUtils";
import { v4 as uuidv4 } from 'uuid';
import { sortChildIDS, identifyDeletedSelfAndChildrenIDS, sanitizeTreeNodeEntry } from "./treeUtils";
import type { AICSubjectOverrides } from "../../components/addItemCard/types";

export default class TreeContextManager {
    constructor() { }

    static initTree(nodes: TreeNode[]) {
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

    static addNode(tree: TreeStateType, pageType: "game" | "profile" | "subject", inputText: string, parentID: string, overrides?: AICSubjectOverrides) {
        sanitizeTreeNodeEntry(inputText, tree, parentID);
        let node: TreeNode;
        switch (pageType) {
            case "game":
                node = TreeContextManager.createGame(inputText);
                break;
            case "profile":
                node = TreeContextManager.createProfile(inputText, parentID);
                break;
            case "subject":
                node = TreeContextManager.createSubject(inputText, parentID);
                node = {...node, ...overrides}
                break;
        }

        const updatedTreeIP = createShallowCopyMap(tree);
        updatedTreeIP.set(node.id, node);
        const actionAddSelf = TreeContextManager.createAction(node, "add") as ActionAdd;

        const { updatedTree, action: actionUpdateParent } = TreeContextManager.updateParentNode(updatedTreeIP, node, tree.get(parentID)!, "add");

        return { updatedTree, actions: { self: actionAddSelf, parent: actionUpdateParent } }
    }

    static deleteNode(tree: TreeStateType, node: TreeNode, parentID: string) {
        const updatedTreeIP = createShallowCopyMap(tree);
        const nodeIDSToBeDeleted = identifyDeletedSelfAndChildrenIDS(node, tree);
        nodeIDSToBeDeleted.forEach((id) => updatedTreeIP.delete(id));
        const actionDeletedIDs = TreeContextManager.createAction(node, "delete", nodeIDSToBeDeleted) as ActionDelete;

        const { updatedTree, action: actionUpdateParent } = TreeContextManager.updateParentNode(updatedTreeIP, node, tree.get(parentID)!, "delete");
        return { updatedTree, actions: { self: actionDeletedIDs, parent: actionUpdateParent } }
    }

    static updateNode(tree: TreeStateType, node: TreeNode, overrides: Partial<TreeNode>, parentID: string) {
        const updatedTreeIP = createShallowCopyMap(tree);
        const updatedNode = { ...node, ...overrides };
        updatedTreeIP.set(node.id, updatedNode);
        const actionUpdateSelf = TreeContextManager.createAction(updatedNode, "update") as ActionUpdate;

        const { updatedTree, action: actionUpdateParent } =
            TreeContextManager.updateParentNode(
                updatedTreeIP,
                actionUpdateSelf.targets,
                tree.get(parentID)!,
                "update",
            );
            
        return { updatedTree, actions: { self: actionUpdateSelf, parent: actionUpdateParent } };
    }

    static updateParentNode(tree: TreeStateType, node: TreeNode, parentNode: TreeNode, parentNodeModeContext?: "add" | "delete" | "update") {
        const updatedTree = createShallowCopyMap(tree);
        const parentNodeCopy: TreeNode = { ...parentNode!, childIDS: [...parentNode!.childIDS] };
        if (parentNodeModeContext == "add") {
            parentNodeCopy.childIDS.push(node.id);
        }
        else if (parentNodeModeContext == "delete") {
            parentNodeCopy.childIDS = parentNodeCopy.childIDS.filter((id) => id != node.id);
        }
        parentNodeCopy.childIDS = sortChildIDS(parentNodeCopy, updatedTree);
        updatedTree.set(parentNodeCopy.id, parentNodeCopy);
        const action = TreeContextManager.createAction(parentNodeCopy, "update") as ActionUpdate;
        return { updatedTree, action };
    }

    static createAction(node: TreeNode, actionType: ActionType, nodeIDSToBeDeleted?: string[]) {
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
        const rootNode: RootNode = { type: "ROOT_NODE", id: "ROOT_NODE", childIDS: [], parentID: null, name: "", completed: false, notes: null, dateStart: "", dateEnd: "" };
        return rootNode
    }

    static createGame(
        inputText: string,
    ) {
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
        };
        return defaultGame
    }

    static createProfile(
        inputText: string,
        parentID: string,
    ) {
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
        };
        return defaultProfile
    }

    static createSubject(
        inputText: string,
        parentID: string,
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
            fullTries: 0,
            resets: 0,
            composite: false,
            compositeRelations: [],
            reoccurring: false,
            context: "boss"
        };
        return defaultSubject



    }

}