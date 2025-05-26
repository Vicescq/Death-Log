import { useEffect } from "react";
import APIManager from "../classes/APIManager";
import type { HistoryStateType } from "../contexts/historyContext";

export default function usePollNodeStatus(historyState: HistoryStateType) {
    
    useEffect(() => {
        const interval = setInterval(() => {
                const deduplicatedHistoryState = APIManager.deduplicateHistory(historyState);
                console.log(historyState)
                if (historyState.actionHistory.length > 0) {
                    APIManager.storeModifiedNode(historyState);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [historyState]);
}