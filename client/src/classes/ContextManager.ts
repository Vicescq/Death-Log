import type { TreeContextType, TreeStateType, URLMapContextType, } from "../context";
import Collection from "./Collection";
import Death from "./Death";
import Game from "./Game";
import Profile from "./Profile";
import RootNode from "./RootNode";
import Subject from "./Subject";
import type TreeNode from "./TreeNode";

export default class ContextManager {

    constructor() { }

    static addNode(tree: TreeStateType, setTree: TreeContextType[1], node: TreeNode, urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1]) {
        let updatedTree = ContextManager.createDeepCopyTree(tree);;
        if (node instanceof RootNode) {
            updatedTree.set(node.id, node);
        }
        else {
            const parentNode = updatedTree.get(node.parentID()!)!
            parentNode.childIDS.push(node.id);
            updatedTree.set(node.id, node);
        }

        if (node instanceof Collection) {
            const deepCopyURLMap = ContextManager.createDeepCopyURLMap(urlMap);
            if (node instanceof Game) {
                deepCopyURLMap.set(node.path, [node.id]);
            }
            else {
                deepCopyURLMap.set(node.path, [...node.ancestry.slice(1), node.id]);
            }
            setURLMap(deepCopyURLMap);
        }

        setTree(updatedTree);
    }

    static deleteNode(tree: TreeStateType, setTree: TreeContextType[1], node: TreeNode, urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1]) {
        const deepCopyURLMap = ContextManager.createDeepCopyURLMap(urlMap);
        if (!(node instanceof RootNode)) {
            let updatedTree = ContextManager.createDeepCopyTree(tree);

            function deleteDescendents(node: TreeNode) {
                if (node.childIDS.length == 0) {
                    if (node instanceof Collection) {
                        deepCopyURLMap.delete(node.path)
                    }
                    updatedTree.delete(node.id);
                    return;
                }

                for (let i = 0; i < node.childIDS.length; i++) {
                    deleteDescendents(updatedTree.get(node.childIDS[i])!);
                }
            }
            deleteDescendents(node);
            const parentNode = updatedTree.get(node.parentID()!)
            const targetIndex = parentNode?.childIDS.indexOf(node.id)!;
            parentNode?.childIDS.splice(targetIndex, 1);
            if (node instanceof Collection) {
                deepCopyURLMap.delete(node.path)
            }
            updatedTree.delete(node.id);
            setURLMap(deepCopyURLMap);
            setTree(updatedTree)
        }
    }

    static createDeepCopyTree(tree: TreeStateType): TreeStateType {
        const objLiteralFromTree = Object.fromEntries(tree);
        const objLiteralFromTreeDeepCopy = { ...objLiteralFromTree };
        return new Map(Object.entries(objLiteralFromTreeDeepCopy));
    }

    static createDeepCopyURLMap(urlMap: URLMapContextType[0]): URLMapContextType[0] {
        const deepCopyURLMap = new Map();
        urlMap.forEach((ids, path) => {
            deepCopyURLMap.set(path, [...ids]);
        })
        return deepCopyURLMap;
    }

    static deserializeGames(serializedObj: string): Game[] {
        return JSON.parse(serializedObj, (_, value) => {
            switch (value?._type) { // NOTE: value?._type is needed rather than value._type bc to account for undefined/null errors where value is either undefined or null
                case "game":
                    return new Game(value._name, value._items, value._path, value._indices);
                case "profile":
                    return new Profile(value._name, value._items, value._path, value._indices);
                case "subject":
                    return new Subject(value._name, value._items, value._path, value._indices);
                case "death":
                    return new Death(value._note, value._tags, value._deathType, value._date);
                default:
                    return value;
            }
        });
    }
 
}
