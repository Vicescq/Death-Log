import { createContext, useState, type ReactNode } from "react";
import type Game from "./classes/Game";

export type GamesContextType = [Game[], React.Dispatch<React.SetStateAction<Game[]>>];
export type HistoryContextType = [HistoryStateType, React.Dispatch<React.SetStateAction<HistoryStateType>>];
export type URLMapContextType = [URLMapStateType, React.Dispatch<React.SetStateAction<URLMapStateType>>]

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
export type URLMapStateValueType = {
    gameID: string,
    profileID: string,
    subjectID: string
}
export type URLMapStateType = Map<string, URLMapStateValueType>;

export const GamesContext = createContext<GamesContextType | undefined>(undefined);
export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);
export const URLMapContext = createContext<URLMapContextType | undefined>(undefined);

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
    });
    const [urlMap, setURLMap] = useState<URLMapStateType>(new Map());

    return (
        <GamesContext.Provider value={[games, setGames]}>
            <HistoryContext.Provider value={[history, setHistory]}>
                <URLMapContext.Provider value={[urlMap, setURLMap]}>
                    {children}
                </URLMapContext.Provider>
            </HistoryContext.Provider>
        </GamesContext.Provider>
    )
}