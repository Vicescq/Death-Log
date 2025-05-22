import type { URLMapContextType, URLMapStateType, URLMapStateValueType } from "../context";
import Death from "./Death";
import Game from "./Game";
import Profile from "./Profile";
import Subject from "./Subject";
import type TreeNode from "./TreeNode";
export type GamesStateCustomTypes = "game" | "profile" | "subject" | "death";

export default class ContextManager {

    constructor() { }

    static updateGamesContext(games: Game[], updatedGame: Game, updatedGameIndex: number) {
        let updatedContext;
        let slicedArrayFirst;
        let slicedArraySecond;
        if (updatedGameIndex == 0) {
            slicedArraySecond = games.slice(1);
            updatedContext = [updatedGame, ...slicedArraySecond];
        }

        else if (updatedGameIndex == games.length - 1) {
            slicedArrayFirst = games.slice(0, updatedGameIndex);
            updatedContext = [...slicedArrayFirst, updatedGame];
        }

        else {
            slicedArrayFirst = games.slice(0, updatedGameIndex);
            slicedArraySecond = games.slice(updatedGameIndex + 1, games.length);
            updatedContext = [...slicedArrayFirst, updatedGame, ...slicedArraySecond];
        }

        return updatedContext
    }

    static serializeGamesContext(games: Game[]) {
        return JSON.stringify(games)
    }

    static deserializeGamesContext(serializedObj: string): Game[] {
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

    static updateURLMapContext(objContext: TreeNode, urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1], ...parentIDS: string[]) {
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
