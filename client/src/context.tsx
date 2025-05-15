import { createContext, useContext, useState, type ReactNode } from "react";
import type Game from "./classes/Game";

type GamesContextType = [Game[], React.Dispatch<React.SetStateAction<Game[]>>]
export const GamesContext = createContext<GamesContextType | undefined>(undefined);

export function GamesContextWrapper({ children }: { children: ReactNode }) {
    // 2 conditions before here, if persistent data exists init, deserialize and then init as state, otherwise init state as []
    
    const [games, setGames] = useState<Game[]>([]);
    
    return (
        <GamesContext.Provider value={[games, setGames]}>
            {children}
        </GamesContext.Provider>
    )
}

export function useGamesContext(){
    const gamesContext = useContext(GamesContext);
    if (gamesContext === undefined){
        throw new Error("DEVELOPMENT ERROR! MAKE SURE TO INSTANTIATE GamesContext to be undefined in context.tsx!");
    }
    return gamesContext;
}

export function updateGamesContext(games: Game[], updatedGame: Game, targetIndex: number){
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