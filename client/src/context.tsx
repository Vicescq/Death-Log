import { createContext, useContext, useState, type ReactNode } from "react";
import type Game from "./classes/Game";

type GamesContextType = [Game[], React.Dispatch<React.SetStateAction<Game[]>>]
export const GamesContext = createContext<GamesContextType | undefined>(undefined);

export function GamesContextWrapper({ children }: { children: ReactNode }) {
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