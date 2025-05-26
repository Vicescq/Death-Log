import type { HistoryStateType } from "../contexts/historyContext";
import type Action from "./Action";

export default class APIManager {
    constructor() { };

    static storeModifiedNode(historyState: HistoryStateType) {
        console.log(historyState)
        const serializedHistory = JSON.stringify(historyState);
        fetch("/api/node", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: serializedHistory
        })
    }

    static deduplicateHistory(history: HistoryStateType) {
        const deduplicatedHistory = {
            userID: history.userID,
            actionHistory: []
        } as HistoryStateType;
        const nodeIDToActionMap = new Map() as Map<string, Action>;

        history.actionHistory.forEach((action) => {
            action.targets.forEach((node) => {
                if (action.type == "update") {
                    if (nodeIDToActionMap.has(node.id)) {
                        nodeIDToActionMap.delete(node.id);
                        nodeIDToActionMap.set(node.id, action);
                    }
                }
                else{
                    nodeIDToActionMap.set(node.id, action);
                }
            })
        })
        deduplicatedHistory.actionHistory =  Array.from(new Set(nodeIDToActionMap.values()));
        return deduplicatedHistory;
    }
}