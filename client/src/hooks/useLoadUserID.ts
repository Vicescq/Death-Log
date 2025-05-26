import { useEffect } from "react";
import type { HistoryContextType } from "../contexts/historyContext";

export default function useLoadUserID(isLoaded: boolean, userId: string | null | undefined, history: HistoryContextType[0], setHistory: HistoryContextType[1]) {
    useEffect(() => {
        if (isLoaded && userId) {
            const newHistory = { ...history };
            newHistory.userID = userId;
            setHistory(newHistory);
        }
    }, [isLoaded, userId])
}