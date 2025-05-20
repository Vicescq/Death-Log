import { createContext, useState, type ReactNode } from "react";
import type Game from "./classes/Game";

type GamesContextType = [Game[], React.Dispatch<React.SetStateAction<Game[]>>];
type HistoryContextType = [HistoryStateType, React.Dispatch<React.SetStateAction<HistoryStateType>>];
export type HistoryStateType = {
    undo: {
        index: number,
        stack: Game[]
    }
    redo: {
        index: number,
        stack: Game[]
    }
}

export type GamesStateCustomTypes = "game" | "profile" | "subject" | "death";

export const GamesContext = createContext<GamesContextType | undefined>(undefined);
export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function ContextWrapper({ children }: { children: ReactNode }) {
    // 2 conditions before here, if persistent data exists init, deserialize and then init as state, otherwise init state as []

    const [games, setGames] = useState<Game[]>([]);
    const [history, setHistory] = useState<HistoryStateType>({
        undo: {
            index: -1,
            stack: []
        },
        redo: {
            index: -1,
            stack: []
        }
    })

    return (
        <GamesContext.Provider value={[games, setGames]}>
            <HistoryContext.Provider value={[history, setHistory]}>
                {children}
            </HistoryContext.Provider>
        </GamesContext.Provider>
    )
}