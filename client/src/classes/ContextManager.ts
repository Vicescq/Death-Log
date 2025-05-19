import type { ContextTypes } from "../context";
import type Collection from "./Collection";
import Death from "./Death";
import Game from "./Game";
import Profile from "./Profile";
import Subject from "./Subject";

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

    static createCardPath<T>(objContext: Collection<T>, currentCardPathParamsObj: URLSearchParams, objContextIndex: number, games: Game[]): string {
        let strPath = "";
        if (objContext instanceof Game) {
            const sParams = "?gi=" + objContextIndex;
            strPath = objContext.name.replaceAll(" ", "_") + sParams
        }

        else if (objContext instanceof Profile) {
            const sParams = "?gi=" + currentCardPathParamsObj.get("gi")! + "&pi=" + objContextIndex
            strPath = objContext.name.replaceAll(" ", "_") + sParams
        }

        else {
            const sParams = "?gi=" + currentCardPathParamsObj.get("gi")! + "&pi=" + currentCardPathParamsObj.get("pi")! + "&si=" + objContextIndex
            strPath = sParams
        }

        return strPath
    }

    static serializeGamesContext(games: Game[]){
        return JSON.stringify(games)
    }

    static reviveGamesContext(serializedObj: string): Game[] {
        return JSON.parse(serializedObj, (_, value) => {
            switch (value?._type as ContextTypes | undefined) { // NOTE: value?._type is needed rather than value._type bc to account for undefined/null errors where value is either undefined or null
                case "game":
                    return new Game(value._name, value._items);
                case "profile":
                    return new Profile(value._name, value._items);
                case "subject":
                    return new Subject(value._name, value._items, value._fullTries, value._resets);
                case "death":
                    return new Death(value._note, value._tags, value._deathType, value._date);
                default:
                    return value;
            }
        });
    }

}

