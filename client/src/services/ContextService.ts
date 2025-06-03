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

            // un-notable logic
            if (node instanceof Subject && !node.notable && !parentNode.childIDS.includes(node.id)) {
                const startUnnotableIndex = parentNode.childIDS.findIndex((id) => {
                    const subject = tree.get(id) as Subject;
                    return subject.notable
                });

                // if notables present
                if (startUnnotableIndex != -1) {
                    parentNode.childIDS = parentNode.childIDS.slice(0, startUnnotableIndex).concat([node.id]).concat(parentNode.childIDS.slice(startUnnotableIndex));
                }

                else{
                     parentNode.childIDS.push(node.id);
                }
            }

            // if node not in db already
            if (!parentNode.childIDS.includes(node.id)) {
                parentNode.childIDS.push(node.id);
            }

            // url map updates
            if (!(node instanceof Subject)) {
                shallowCopyURLMap.set(node.path, node.id);
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

        function reviver(obj: any): TreeNode {
            switch (obj._type) {
                case "root":
                    return new RootNode(obj._childIDS);
                case "game":
                    return new Game(obj._name, obj._path, obj._parentID, obj._childIDS, obj._id, obj._date, obj._completed);
                case "profile":
                    return new Profile(obj._name, obj._path, obj._parentID, obj._id, obj._childIDS, obj._date, obj._completed);
                case "subject":
                    return new Subject(obj._name, obj._parentID, obj._notable, obj._fullTries, obj._resets, obj._id, obj._date, obj._completed);
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
