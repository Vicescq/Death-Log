import { useEffect } from "react";
import type { HistoryContextType, HistoryStateType } from "../contexts/historyContext";
import APIService from "../services/APIService";
import type { UUIDStateType } from "../contexts/uuidContext";

export default function usePostDeathLog(uuid: UUIDStateType, history: HistoryStateType, setHistory: HistoryContextType[1]) {

    useEffect(() => {
        const interval = setTimeout(() => {
            if (history.actionHistory.slice(history.newActionStartIndex).length > 0) {
                const batchedHistoryState = APIService.batchHistory(history);
                APIService.postDeathLog(uuid!, batchedHistoryState.actionHistory);
                const updatedHistory = { ...history, newActionStartIndex: history.actionHistory.length };
                setHistory(updatedHistory);
            }
        }, 3000);
        return () => clearTimeout(interval);
    }, [history]);
}