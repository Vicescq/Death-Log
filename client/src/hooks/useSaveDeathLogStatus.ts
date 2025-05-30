import { useEffect } from "react";
import APIManager from "../classes/APIManager";
import type { HistoryContextType, HistoryStateType } from "../contexts/historyContext";
import ContextManager from "../classes/ContextManager";

export default function useSaveDeathLogStatus(history: HistoryStateType, setHistory: HistoryContextType[1]) {

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