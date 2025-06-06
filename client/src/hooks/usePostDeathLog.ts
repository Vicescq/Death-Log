import { useEffect } from "react";
import type { HistoryContextType, HistoryStateType } from "../contexts/historyContext";
import APIService from "../services/APIService";
import type { UUIDStateType } from "../contexts/uuidContext";
import HistoryContextManager from "../features/HistoryContextManager";

export default function usePostDeathLog(uuid: UUIDStateType, history: HistoryStateType, setHistory: HistoryContextType[1]) {

    useEffect(() => {
        const interval = setTimeout(() => {
            if (history.actionHistory.slice(history.newActionStartIndex).length > 0) {
                APIService.postDeathLog(uuid!, HistoryContextManager.batchHistory(history));
                setHistory(HistoryContextManager.updateNewActionStartIndex(history));
            }
        }, 3000);
        return () => clearTimeout(interval);
    }, [history]);
}