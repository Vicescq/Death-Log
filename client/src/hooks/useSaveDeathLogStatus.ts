import { useEffect } from "react";
import APIManager from "../classes/APIManager";
import type { HistoryStateType } from "../contexts/historyContext";

export default function useSaveDeathLogStatus(historyState: HistoryStateType, currentHistoryIndexRef: React.RefObject<number>) {

    useEffect(() => {
        const interval = setTimeout(() => {
            if (historyState.actionHistory.slice(currentHistoryIndexRef.current).length > 0) {
                const deduplicatedHistoryState = APIManager.deduplicateHistory(historyState, currentHistoryIndexRef);
                APIManager.storeModifiedNode(deduplicatedHistoryState);
                currentHistoryIndexRef.current = historyState.actionHistory.length
            }
        }, 3000);
        return () => clearTimeout(interval);
    }, [historyState]);
}