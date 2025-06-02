import { useEffect } from "react";
import type { HistoryContextType, HistoryStateType } from "../contexts/historyContext";
import APIManager from "../services/APIManager";
import ContextManager from "../services/ContextManager";

export default function usePostDeathLog(history: HistoryStateType, setHistory: HistoryContextType[1]) {

    useEffect(() => {
        const interval = setTimeout(() => {
            if (history.actionHistory.slice(history.newActionStartIndex).length > 0) {
                const deduplicatedHistoryState = APIManager.deduplicateHistory(history);
                APIManager.postDeathLog(deduplicatedHistoryState.uuid, deduplicatedHistoryState);
                ContextManager.updateNewActionStartIndex(history, setHistory);
            }
        }, 3000);
        return () => clearTimeout(interval);
    }, [history]);
}