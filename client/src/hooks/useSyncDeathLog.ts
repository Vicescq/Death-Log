import { useEffect } from "react";
import type { HistoryContextType, HistoryStateType } from "../contexts/historyContext";
import APIService from "../services/APIService";
import HistoryContextManager from "../features/HistoryContextManager";
import type { UserStateType } from "../contexts/userContext";
import { auth } from "../firebase-config";
import type { DistinctTreeNode } from "../model/TreeNodeModel";

export default function useSyncDeathLog(user: UserStateType, history: HistoryStateType, setHistory: HistoryContextType[1]) {

    useEffect(() => {
        const interval = setTimeout(() => {
            if (history.actionHistory.slice(history.newActionStartIndex).length > 0 && user) {
                (async () => {
                    const token = await user.getIdToken();
                    const nodes = HistoryContextManager.batchHistory(history).map((action) => {
                        const addedNode = action.targets as DistinctTreeNode
                        return addedNode
                    })
                    user.email ? APIService.addNodes(user.email, token, nodes) : null;
                })();
                setHistory(HistoryContextManager.updateNewActionStartIndex(history));
            }
        }, 3000);
        return () => clearTimeout(interval);
    }, [history]);
}