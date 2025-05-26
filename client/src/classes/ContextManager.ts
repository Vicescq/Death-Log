import type { HistoryContextType, HistoryStateType } from "../contexts/historyContext";
import type { TreeContextType, TreeStateType } from "../contexts/treeContext";
import type { URLMapContextType } from "../contexts/urlMapContext";
import type Action from "./Action";
import Game from "./Game";
import Profile from "./Profile";
import RootNode from "./RootNode";
import Subject from "./Subject";
import type TreeNode from "./TreeNode";

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
            if (node.type != "subject"){
                const deepCopyURLMap = ContextManager.createDeepCopyURLMap(urlMap);
                deepCopyURLMap.set(node.path, node.id);
                setURLMap(deepCopyURLMap);
            }
            
        }
        setTree(deepCopyTree);
    }

    static deleteNode(tree: TreeStateType, setTree: TreeContextType[1], node: TreeNode, urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1]) {
        const deepCopyURLMap = ContextManager.createDeepCopyURLMap(urlMap);
        if (!(node instanceof RootNode)) {
            let deepCopyTree = ContextManager.createDeepCopyTree(tree);

            function deleteSelfAndChild(node: TreeNode) {

                // leaf nodes
                if (node.childIDS.length == 0) {
                    deepCopyURLMap.delete(node.path)
                    deepCopyTree.delete(node.id);
                    return;
                }

                // iterate every child node
                for (let i = 0; i < node.childIDS.length; i++) {
                    deleteSelfAndChild(deepCopyTree.get(node.childIDS[i])!);
                }

                // deleting current node
                deepCopyTree.delete(node.id);
                deepCopyURLMap.delete(node.path);
            }

            const parentNode = deepCopyTree.get(node.parentID!);
            const targetIndex = parentNode?.childIDS.indexOf(node.id)!;
            parentNode?.childIDS.splice(targetIndex, 1);
            deleteSelfAndChild(node);

            setURLMap(deepCopyURLMap);
            setTree(deepCopyTree)
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

    static deserializeTree(serializedTree: string, setTree: TreeContextType[1], setURLMap: URLMapContextType[1]) {
        const objLiteral = JSON.parse(serializedTree, (_, value) => {
            switch (value?._type) {
                case "root":
                    return new RootNode(value._childIDS);
                case "game":
                    return new Game(value._name, value._path, value._parentID, value._childIDS, value._id, value._date);
                case "profile":
                    return new Profile(value._name, value._path, value._parentID, value._id, value._childIDS, value._date);
                case "subject":
                    return new Subject(value._name, value._parentID, value._notable, value._fullTries, value._resets, value._id, value._date);
                default:
                    return value;
            }
        });
        const tree = new Map(Object.entries(objLiteral)) as TreeStateType;
        const urlMap = new Map() as URLMapContextType[0];
        tree.entries().forEach((idAndNode) => {
            const id = idAndNode[0];
            const node = idAndNode[1];
            if (node.type != "root") {
                urlMap.set(node.path, id);
            }
        });
        setTree(tree);
        setURLMap(urlMap);
    }

    static updateHistory(history: HistoryContextType[0], setHistory: HistoryContextType[1], action: Action){
        const updatedHistory = {...history};
        updatedHistory.actionHistory.push(action);
        setHistory(updatedHistory)
    }
}
