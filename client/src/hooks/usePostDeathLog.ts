import { useEffect } from "react";
import type { HistoryContextType, HistoryStateType } from "../contexts/historyContext";
import APIService from "../services/APIService";
import ContextService from "../services/ContextService";

export default function usePostDeathLog(history: HistoryStateType, setHistory: HistoryContextType[1]) {

    useEffect(() => {
        const interval = setTimeout(() => {
            if (history.actionHistory.slice(history.newActionStartIndex).length > 0) {
                const deduplicatedHistoryState = APIService.deduplicateHistory(history);
                APIService.postDeathLog(deduplicatedHistoryState.uuid, deduplicatedHistoryState.actionHistory);
                ContextService.updateNewActionStartIndex(history, setHistory);
            }
        }, 3000);
        return () => clearTimeout(interval);
    }, [history]);
}