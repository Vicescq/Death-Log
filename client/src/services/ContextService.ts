import type Action from "../model/Action";
import Game from "../model/Game";
import Profile from "../model/Profile";
import RootNode from "../model/RootNode";
import Subject from "../model/Subject";
import type TreeNode from "../model/TreeNode";
import type { HistoryContextType } from "../contexts/historyContext";
import type { TreeContextType, TreeStateType } from "../contexts/treeContext";
import type { URLMapContextType, URLMapStateType } from "../contexts/urlMapContext";
import { createShallowCopyMap } from "../utils/treeUtils";

export default class ContextService {

    constructor() { }

    static addNodes(tree: TreeStateType, setTree: TreeContextType[1], urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1], nodes: TreeNode[]) {
        const shallowCopyTree = createShallowCopyMap(tree);
        const shallowCopyURLMap = createShallowCopyMap(urlMap);

        nodes.forEach((node) => {
            shallowCopyTree.set(node.id, node);
            const parentNode = shallowCopyTree.get(node.parentID!)!

            if (node instanceof Subject && !node.notable && !parentNode.childIDS.includes(node.id)) {
                parentNode.childIDS.unshift(node.id)
            }

            if (node.type != "subject") {
                shallowCopyURLMap.set(node.path, node.id);
            }

            if (node instanceof Game || parentNode.childIDS.length == 0) {
                parentNode.childIDS.push(node.id);
            }

            else if (!parentNode.childIDS.includes(node.id)) {
                parentNode.childIDS.push(node.id);
            }
        })
        setTree(shallowCopyTree);
        setURLMap(shallowCopyURLMap);
    }

    static deleteNode(tree: TreeStateType, setTree: TreeContextType[1], node: TreeNode, urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1]) {
        const nodesDeleted: TreeNode[] = [];
        const shallowCopyURLMap = createShallowCopyMap(urlMap);
        if (!(node instanceof RootNode)) {
            let shallowCopyTree = createShallowCopyMap(tree);

            function deleteSelfAndChild(node: TreeNode) {

                // leaf nodes
                if (node.childIDS.length == 0) {
                    nodesDeleted.push(tree.get(node.id)!);
                    shallowCopyURLMap.delete(node.path)
                    shallowCopyTree.delete(node.id);
                    return;
                }

                // iterate every child node
                for (let i = 0; i < node.childIDS.length; i++) {
                    deleteSelfAndChild(shallowCopyTree.get(node.childIDS[i])!);
                }

                // deleting current node
                nodesDeleted.push(tree.get(node.id)!);
                shallowCopyTree.delete(node.id);
                shallowCopyURLMap.delete(node.path);
            }

            const parentNode = shallowCopyTree.get(node.parentID!);
            const targetIndex = parentNode?.childIDS.indexOf(node.id)!;
            parentNode?.childIDS.splice(targetIndex, 1);
            deleteSelfAndChild(node);

            setURLMap(shallowCopyURLMap);
            setTree(shallowCopyTree)
            return nodesDeleted;
        }
    }

    static updateNode(updatedNode: TreeNode, tree: TreeStateType, setTree: TreeContextType[1]) {
        const shallowCopyTree = createShallowCopyMap(tree);
        shallowCopyTree.set(updatedNode.id, updatedNode);
        setTree(shallowCopyTree);
    }

    

    static initializeTreeState(serializedTree: object[], setTree: TreeContextType[1], setURLMap: URLMapContextType[1]) {

        const urlMap: URLMapStateType = new Map();
        const tree: TreeStateType = new Map();

        function migrationNewCompletedField(revived: TreeNode) {
            if (revived.completed == undefined) {
                revived.completed = false;
            }
            return revived
        }

        function reviver(obj: any): TreeNode {
            let revived: TreeNode;
            switch (obj._type) {
                case "root":
                    revived = Object.assign(Object.create(RootNode.prototype), obj);
                    return migrationNewCompletedField(revived);
                case "game":
                    revived = Object.assign(Object.create(Game.prototype), obj);
                    return migrationNewCompletedField(revived);
                case "profile":
                    revived = Object.assign(Object.create(Profile.prototype), obj);
                    return migrationNewCompletedField(revived);
                case "subject":
                    revived = Object.assign(Object.create(Subject.prototype), obj);
                    return migrationNewCompletedField(revived);
                default:
                    return obj;
            }
        }

        const rootNode = new RootNode();
        tree.set(rootNode.id, rootNode);
        const revivedNodes: TreeNode[] = [];

        for (const [_, outerLiteral] of Object.entries(serializedTree)) {
            for (const [_, innerLiteral] of Object.entries(outerLiteral)) {
                const revivedNode = reviver(JSON.parse(innerLiteral));
                revivedNodes.push(revivedNode);
            }
        }
        ContextService.addNodes(tree, setTree, urlMap, setURLMap, [...revivedNodes])
    }

    static updateActionHistory(history: HistoryContextType[0], setHistory: HistoryContextType[1], ...actions: Action[]) {
        const updatedHistory = { ...history };
        actions.forEach((action) => updatedHistory.actionHistory.push(action));
        setHistory(updatedHistory);
    }

    static updateNewActionStartIndex(history: HistoryContextType[0], setHistory: HistoryContextType[1]) {
        const updatedHistory = { ...history, newActionStartIndex: history.actionHistory.length };
        setHistory(updatedHistory);
    }
}
