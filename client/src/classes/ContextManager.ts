import type { TreeContextType, TreeStateType, URLMapContextType, URLMapStateType, URLMapStateValueType } from "../context";
import type Collection from "./Collection";
import Death from "./Death";
import Game from "./Game";
import Profile from "./Profile";
import Subject from "./Subject";
import type TreeNode from "./TreeNode";

export default class ContextManager {

    constructor() { }

    static addNode(tree: TreeStateType, setTree: TreeContextType[1], node: TreeNode) {
        let updatedTree = ContextManager.createDeepCopyTree(tree);;
        if (node.type == "root") {
            updatedTree.set(node.id, node);
        }
        else {
            const parentNode = updatedTree.get(node.parentID!)!
            parentNode.childIDS.push(node.id);
            updatedTree.set(node.id, node);
        }
        setTree(updatedTree);
    }

    static deleteNode(tree: TreeStateType, setTree: TreeContextType[1], node: TreeNode){
        
        if (node.type != "root"){
            let updatedTree = ContextManager.createDeepCopyTree(tree);
    
            function deleteDescendents(node: TreeNode){
                if (node.childIDS.length == 0){
                    updatedTree.delete(node.id);
                    return;
                }

                for (let i = 0; i < node.childIDS.length; i++){
                    deleteDescendents(updatedTree.get(node.childIDS[i])!)
                }
            }
            deleteDescendents(node);
            const parentNode = updatedTree.get(node.parentID!)
            const targetIndex = parentNode?.childIDS.indexOf(node.id)!;
            parentNode?.childIDS.splice(targetIndex, 1);
            updatedTree.delete(node.id);
            setTree(updatedTree)
        }
    }

    static createDeepCopyTree(tree: TreeContextType[0]): TreeStateType {
        const objLiteralFromTree = Object.fromEntries(tree);
        const objLiteralFromTreeDeepCopy = { ...objLiteralFromTree };
        return new Map(Object.entries(objLiteralFromTreeDeepCopy));
    }

    static serializeGames(games: Game[]) {
        return JSON.stringify(games)
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

    static addNewURLMapping<T>(objContext: Collection<T>, urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1], ...parentIDS: string[]) {
        const deepCopyURLMap: URLMapStateType = new Map();
        urlMap.forEach((value, key) => {
            deepCopyURLMap.set(key, value);
        });

        let urlMapValue: URLMapStateValueType;

        if (objContext.type == "game") {
            urlMapValue = {
                gameID: objContext.id,
                profileID: "",
                subjectID: ""
            }
        }

        else if (objContext.type == "profile") {
            urlMapValue = {
                gameID: parentIDS[0],
                profileID: objContext.id,
                subjectID: ""
            }
        }

        else {
            urlMapValue = {
                gameID: parentIDS[0],
                profileID: parentIDS[1],
                subjectID: objContext.id
            }
        }

        deepCopyURLMap.set(objContext.path, urlMapValue);
        setURLMap(deepCopyURLMap)
    }

    static deleteURLMapping(urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1], node: TreeNode) {
        const deepCopyURLMap: URLMapStateType = new Map();
        urlMap.forEach((value, key) => {
            deepCopyURLMap.set(key, value);
        });

        function severSubTreeURLReferences(node: TreeNode) {

            if (node.type == "subject") {
                const subject = node as Subject;
                deepCopyURLMap.delete(subject.path);
                return;
            }

            else if (node.type == "profile") {
                const profile = node as Profile
                for (let i = 0; i < profile.items.length; i++) {
                    severSubTreeURLReferences(profile.items[i]);
                }
                deepCopyURLMap.delete(profile.path);
            }

            else {
                const game = node as Game
                for (let i = 0; i < game.items.length; i++) {
                    severSubTreeURLReferences(game.items[i]);
                }
                deepCopyURLMap.delete(game.path);
            }
        }

        severSubTreeURLReferences(node);
        setURLMap(deepCopyURLMap);
    }

    static buildURLMapContextOnLoad(games: Game[], urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1]) {

        const deepCopyURLMap: URLMapStateType = new Map();
        urlMap.forEach((value, key) => {
            deepCopyURLMap.set(key, value);
        });

        function buildURLMap(treeNode: TreeNode, ...parentIDS: string[]) {

            if (treeNode.type == "death") {
                return;
            }

            else if (treeNode.type == "subject") {
                const subject = treeNode as Subject;
                deepCopyURLMap.set(subject.path, {
                    gameID: parentIDS[0],
                    profileID: parentIDS[1],
                    subjectID: treeNode.id
                });
                for (let i = 0; i < subject.items.length; i++) {
                    buildURLMap(subject.items[i])
                }
            }

            else if (treeNode.type == "profile") {
                const profile = treeNode as Profile;
                deepCopyURLMap.set(profile.path, {
                    gameID: parentIDS[0],
                    profileID: profile.id,
                    subjectID: ""
                });
                for (let i = 0; i < profile.items.length; i++) {
                    buildURLMap(profile.items[i], parentIDS[0], profile.id)
                }
            }

            else {
                const game = treeNode as Game;
                deepCopyURLMap.set(game.path, {
                    gameID: game.id,
                    profileID: "",
                    subjectID: ""
                });
                for (let i = 0; i < game.items.length; i++) {
                    buildURLMap(game.items[i], game.id)
                }
            }
        }

        for (let i = 0; i < games.length; i++) {
            buildURLMap(games[i]);
        }

        setURLMap(deepCopyURLMap);
    }
}
