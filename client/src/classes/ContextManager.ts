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

    static addNode(tree: TreeStateType, setTree: TreeContextType[1], node: TreeNode, urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1]) {
        const deepCopyTree = ContextManager.createDeepCopyTree(tree);
        if (node instanceof RootNode) {
            deepCopyTree.set(node.id, node);
        }
        else {
            const parentNode = deepCopyTree.get(node.parentID!)!
            if (node instanceof Subject && !node.notable) {
                parentNode.childIDS.unshift(node.id)
            }
            else {
                parentNode.childIDS.push(node.id);
            }
            deepCopyTree.set(node.id, node);
            if (node.type != "subject") {
                const deepCopyURLMap = ContextManager.createDeepCopyURLMap(urlMap);
                deepCopyURLMap.set(node.path, node.id);
                setURLMap(deepCopyURLMap);
            }

        }
        setTree(deepCopyTree);
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

    static serializeTree(tree: TreeStateType) {
        const objLiteralFromTree = Object.fromEntries(tree);
        return JSON.stringify(objLiteralFromTree);
    }

    static deserializeTree(serializedTree: object[], setTree: TreeContextType[1], setURLMap: URLMapContextType[1]) {

        
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
        for (const [_, outerLiteral] of Object.entries(serializedTree)) {
            for (const [nodeID, innerLiteral] of Object.entries(outerLiteral)){
                const revivedNode = reviver(JSON.parse(innerLiteral));

                tree.set(revivedNode.id, revivedNode);
                urlMap.set(revivedNode.path, revivedNode.id);
                if (revivedNode.type == "game"){
                    tree.get(revivedNode.parentID!)?.childIDS.push(revivedNode.id);
                    
                }

            }
        }
        setTree(tree);
        setURLMap(urlMap)
    }

    static updateHistory(history: HistoryContextType[0], setHistory: HistoryContextType[1], action: Action) {
        const updatedHistory = { ...history };
        updatedHistory.actionHistory.push(action);
        setHistory(updatedHistory)
    }
}
