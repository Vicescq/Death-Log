import type Game from "./classes/Game";

export function reconstructCollection<T extends {_name: string, _items: any[]}, U>(serializedObj: T, classConstructor: new (...props: any[]) => U): U {
    const genericObj = Object.create(classConstructor.prototype);
    return Object.assign(genericObj, serializedObj);
}

export function updateGameContext(games: Game[], updatedGame: Game, targetIndex: number){
    let updatedContext;
    let slicedArrayFirst;
    let slicedArraySecond;
    if(targetIndex == 0){
        slicedArraySecond = games.slice(1);
        updatedContext = [updatedGame, ...slicedArraySecond];
    }

    else if(targetIndex == games.length - 1){
        slicedArrayFirst = games.slice(0, targetIndex);
        updatedContext = [...slicedArrayFirst, updatedGame];
    }

    else{
        slicedArrayFirst = games.slice(0, targetIndex);
        slicedArraySecond = games.slice(targetIndex+1, games.length);
        updatedContext = [...slicedArrayFirst, updatedGame, ...slicedArraySecond];
    }

    return updatedContext
}