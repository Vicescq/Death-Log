import { createContext, useContext, useState, type ReactNode } from "react";
import type Game from "./classes/Game";

type GamesContextType = [Game[], React.Dispatch<React.SetStateAction<Game[]>>];
type HistoryContextType = [HistoryStateType, React.Dispatch<React.SetStateAction<HistoryStateType>>];


export type HistoryStateType = {
    undoStack: {
        stack: Game[],
        currentGameIndex: number
    },
    redoStack: {
        stack: Game[],
        currentGameIndex: number
    }
};

export type GamesStateCustomTypes = "game" | "profile" | "subject" | "death";

const GamesContext = createContext<GamesContextType | undefined>(undefined);
const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function ContextWrapper({ children }: { children: ReactNode }) {
    // 2 conditions before here, if persistent data exists init, deserialize and then init as state, otherwise init state as []

    const [games, setGames] = useState<Game[]>([]);
    const [history, setHistory] = useState<HistoryStateType>({
        "undoStack": {
            "stack": [],
            "currentGameIndex": -1
        },
        "redoStack": {
            "stack": [],
            "currentGameIndex": -1
        }
    });


    return (
        <GamesContext.Provider value={[games, setGames]}>
            <HistoryContext.Provider value={[history, setHistory]}>

                {children}

            </HistoryContext.Provider>
        </GamesContext.Provider>
    )
}

export function useGamesContext() {
    const gamesContext = useContext(GamesContext);
    if (gamesContext === undefined) {
        throw new Error("DEVELOPMENT ERROR! MAKE SURE TO INSTANTIATE GamesContext to be undefined in context.tsx!");
    }
    return gamesContext;
}

export function useHistoryContext() {
    const historyContext = useContext(HistoryContext);
    if (historyContext === undefined) {
        throw new Error("DEVELOPMENT ERROR! MAKE SURE TO INSTANTIATE HistoryContext to be undefined in context.tsx!");
    }
    return historyContext;
}