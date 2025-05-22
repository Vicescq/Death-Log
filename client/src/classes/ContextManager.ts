import type { GamesContextType, URLMapContextType, URLMapStateType, URLMapStateValueType } from "../context";
import Death from "./Death";
import Game from "./Game";
import Profile from "./Profile";
import Subject from "./Subject";
import type TreeNode from "./TreeNode";
export type GamesStateCustomTypes = "game" | "profile" | "subject" | "death";

type updateGamesContextStrategy = "add" | "delete";

export default class ContextManager {

    constructor() { }

    static updateGamesContext(games: GamesContextType[0], setGames: GamesContextType[1], upsertedGame: Game, targetedGI: number, strategy: updateGamesContextStrategy, nodeToBeDeleted: TreeNode | null = null) {
        let newGamesState: Game[];
        let slicedArrayFirst;
        let slicedArraySecond;

        if (strategy == "add" || nodeToBeDeleted?.type != "game") {
            if (targetedGI == 0) {
                slicedArraySecond = games.slice(1);
                newGamesState = [upsertedGame, ...slicedArraySecond];
            }

            else if (targetedGI == games.length - 1) {
                slicedArrayFirst = games.slice(0, targetedGI);
                newGamesState = [...slicedArrayFirst, upsertedGame];
            }

            else {
                slicedArrayFirst = games.slice(0, targetedGI);
                slicedArraySecond = games.slice(targetedGI + 1, games.length);
                newGamesState = [...slicedArrayFirst, upsertedGame, ...slicedArraySecond];
            }
        }

        else {

            if (targetedGI == 0) {
                slicedArraySecond = games.slice(1);
                newGamesState = [...slicedArraySecond];
            }

            else if (targetedGI == games.length - 1) {
                slicedArrayFirst = games.slice(0, targetedGI);
                newGamesState = [...slicedArrayFirst];
            }

            else {
                slicedArrayFirst = games.slice(0, targetedGI);
                slicedArraySecond = games.slice(targetedGI + 1, games.length);
                newGamesState = [...slicedArrayFirst, ...slicedArraySecond];
            }
        }

        setGames(newGamesState);
    }

    static addNode(games: GamesContextType[0], setGames: GamesContextType[1], rootNode: Game, node: TreeNode, targetedGI: number, pi: number | null = null) {
        // indices param start from profile not from game since we already have rootNode (Game) acess 
        switch (node.type) {
            case "game":
                break;
            case "profile":
                const profile = node as Profile;
                rootNode.items.push(profile);
                break;
            case "subject":
                const subject = node as Subject;
                rootNode.items[pi!].items.push(subject);
        }
        ContextManager.updateGamesContext(games, setGames, rootNode, targetedGI, "add");
    }

    static deleteNode(games: GamesContextType[0], setGames: GamesContextType[1], rootNode: Game, node: TreeNode, targetedGI: number, pi: number | null = null, si: number | null = null) {
        switch (node.type) {
            case "game":
                break;
            case "profile":
                rootNode.items.splice(pi!, 1);
                break;
            case "subject":
                rootNode.items[pi!].items.splice(si!, 1);
        }
        ContextManager.updateGamesContext(games, setGames, rootNode, targetedGI, "delete", node);
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

    static addNewURLMapping(objContext: TreeNode, urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1], ...parentIDS: string[]) {
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

    static delURLMapping(urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1], pathKey: string) {
        const deepCopyURLMap: URLMapStateType = new Map();
        urlMap.forEach((value, key) => {
            deepCopyURLMap.set(key, value);
        });
        deepCopyURLMap.delete(pathKey);
        setURLMap(deepCopyURLMap);
    }

    static buildURLMapContextOnLoad(games: Game[], urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1]) {

        const deepCopyURLMap: URLMapStateType = new Map();
        urlMap.forEach((value, key) => {
            deepCopyURLMap.set(key, value);
        });

        function buildURLMap(treeNode: TreeNode, ...parentIDS: string[]) {
            console.log(treeNode);
            if (treeNode.type == "death") {
                return;
            }

            else if (treeNode.type == "subject") {
                const subject = treeNode as Subject;
                deepCopyURLMap.set(treeNode.path, {
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
                deepCopyURLMap.set(treeNode.path, {
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
                deepCopyURLMap.set(treeNode.path, {
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
