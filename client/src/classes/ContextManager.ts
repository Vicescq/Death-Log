import type { HistoryContextType } from "../contexts/historyContext";
import type { TreeContextType, TreeStateType } from "../contexts/treeContext";
import type { URLMapContextType, URLMapStateType } from "../contexts/urlMapContext";
import type Action from "./Action";
import Game from "./Game";
import Profile from "./Profile";
import RootNode from "./RootNode";
import Subject from "./Subject";
import TreeNode from "./TreeNode";

export default class ContextManager {

    constructor() { }

    static addNodes(tree: TreeStateType, setTree: TreeContextType[1], urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1], nodes: TreeNode[]) {
        const deepCopyTree = ContextManager.createDeepCopyTree(tree);
        const deepCopyURLMap = ContextManager.createDeepCopyURLMap(urlMap);

        nodes.forEach((node) => {
            deepCopyTree.set(node.id, node);
            const parentNode = deepCopyTree.get(node.parentID!)!

            if (node instanceof Subject && !node.notable) {
                parentNode.childIDS.unshift(node.id) // keep a watch on this, for db syncing
            }

            if (node.type != "subject") {
                deepCopyURLMap.set(node.path, node.id);
            }

            if (node instanceof Game || parentNode.childIDS.length == 0) {
                parentNode.childIDS.push(node.id);
            }

            else {
                parentNode.childIDS.forEach((nodeID) => {
                    if (!(nodeID == node.id)) {
                        parentNode.childIDS.push(node.id); // if adding a new node that did not exist in db
                    }
                })
            }
        })
        setTree(deepCopyTree);
        setURLMap(deepCopyURLMap);
    }

    static deleteNode(tree: TreeStateType, setTree: TreeContextType[1], node: TreeNode, urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1]) {
        const nodesDeleted: TreeNode[] = [];
        const deepCopyURLMap = ContextManager.createDeepCopyURLMap(urlMap);
        if (!(node instanceof RootNode)) {
            let deepCopyTree = ContextManager.createDeepCopyTree(tree);

            function deleteSelfAndChild(node: TreeNode) {

                // leaf nodes
                if (node.childIDS.length == 0) {
                    nodesDeleted.push(tree.get(node.id)!);
                    deepCopyURLMap.delete(node.path)
                    deepCopyTree.delete(node.id);
                    return;
                }

                // iterate every child node
                for (let i = 0; i < node.childIDS.length; i++) {
                    deleteSelfAndChild(deepCopyTree.get(node.childIDS[i])!);
                }

                // deleting current node
                nodesDeleted.push(tree.get(node.id)!);
                deepCopyTree.delete(node.id);
                deepCopyURLMap.delete(node.path);
            }

            const parentNode = deepCopyTree.get(node.parentID!);
            const targetIndex = parentNode?.childIDS.indexOf(node.id)!;
            parentNode?.childIDS.splice(targetIndex, 1);
            deleteSelfAndChild(node);

            setURLMap(deepCopyURLMap);
            setTree(deepCopyTree)
            return nodesDeleted;
        }
    }

    static updateNode(updatedNode: TreeNode, tree: TreeStateType, setTree: TreeContextType[1]) {
        const deepCopyTree = ContextManager.createDeepCopyTree(tree);
        deepCopyTree.set(updatedNode.id, updatedNode);
        setTree(deepCopyTree);
    }

    static createDeepCopyTree(tree: TreeStateType): TreeStateType {
        const objLiteralFromTree = Object.fromEntries(tree);
        const objLiteralFromTreeDeepCopy = { ...objLiteralFromTree };
        return new Map(Object.entries(objLiteralFromTreeDeepCopy));
    }

    static createDeepCopyURLMap(urlMap: URLMapContextType[0]): URLMapContextType[0] {
        const deepCopyURLMap = new Map();
        urlMap.forEach((id, path) => {
            deepCopyURLMap.set(path, id);
        })
        return deepCopyURLMap;
    }

    static initializeTreeState(serializedTree: object[], setTree: TreeContextType[1], setURLMap: URLMapContextType[1]) {

        const urlMap: URLMapStateType = new Map();
        const tree: TreeStateType = new Map();

        function reviver(obj: any): TreeNode {
            switch (obj._type) {
                case "root":
                    return Object.assign(Object.create(RootNode.prototype), obj);
                case "game":
                    return Object.assign(Object.create(Game.prototype), obj);
                case "profile":
                    return Object.assign(Object.create(Profile.prototype), obj);
                case "subject":
                    return Object.assign(Object.create(Subject.prototype), obj);
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
        ContextManager.addNodes(tree, setTree, urlMap, setURLMap, [...revivedNodes])
    }

    static updateHistory(history: HistoryContextType[0], setHistory: HistoryContextType[1], ...actions: Action[]) {
        const updatedHistory = { ...history };
        actions.forEach((action) => updatedHistory.actionHistory.push(action));
        setHistory(updatedHistory);
    }
}
