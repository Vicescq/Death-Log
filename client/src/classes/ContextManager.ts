import type { URLMapContextType, URLMapStateType } from "../context";
import type Collection from "./Collection";
import Death from "./Death";
import Game from "./Game";
import Profile from "./Profile";
import Subject from "./Subject";
import type TreeNode from "./TreeNode";
import type { TreeNodeParentType, TreeNodeType } from "./TreeNode";
export type GamesStateCustomTypes = "game" | "profile" | "subject" | "death";

export default class ContextManager {

    constructor() { }

    static getUpdatedGamesContext(games: Game[], updatedGame: Game, updatedGameIndex: number) {
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

    static reviveGamesContext(serializedObj: string): Game[] {
        return JSON.parse(serializedObj, (index, value) => {
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
