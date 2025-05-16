import type Collection from "./Collection";
import Game from "./Game";
import Profile from "./Profile";

export default class ContextManager {

    constructor() { }

    static reconstructCollection<T extends { _name: string, _items: any[] }, U>(serializedObj: T, classConstructor: new (...props: any[]) => U): U {
        const genericObj = Object.create(classConstructor.prototype);
        return Object.assign(genericObj, serializedObj);
    }

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
            strPath = objContext.name + sParams
        }
        
        else if (objContext instanceof Profile) {
            const sParams = "?gi=" + currentCardPathParamsObj.get("gi")! + "&pi=" + objContextIndex
            strPath = objContext.name + sParams
        }

        else{
            const sParams = "?gi=" + currentCardPathParamsObj.get("gi")! + "&pi=" + currentCardPathParamsObj.get("pi")! + "&si=" + objContextIndex
            strPath = sParams
        }

        return strPath
    }
}

