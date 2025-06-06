import type { HistoryStateType } from "../contexts/historyContext";
import type { Action } from "../model/Action";
import { v4 as uuid4 } from "uuid";
import type { TreeNode } from "../model/TreeNodeModel";

export default class HistoryContextManager {
    static updateActionHistory(history: HistoryStateType, actions: Action[]) {
        return { ...history, actionHistory: [...history.actionHistory, ...actions] } as HistoryStateType;
    }

    static batchHistory(history: HistoryStateType) {
        const batchedActionHistory = history.actionHistory.slice(history.newActionStartIndex);
        const deduplicatedUpdateActions = new Map<(string | string[]), Action>();
        const finalizedBatchedActionHistory: Action[] = [];
        batchedActionHistory.reverse();
        batchedActionHistory.forEach((action) => {
            if (action.type == "update") {
                const node = action.targets[0] as TreeNode;
                !deduplicatedUpdateActions.has(node.id) ? deduplicatedUpdateActions.set(node.id, action) : null;
            }
            else {
                deduplicatedUpdateActions.set("__PLACEHOLDER__" + uuid4(), action);
            }
        })

        Array.from(deduplicatedUpdateActions.entries()).reverse().forEach((([_, action]) => {
            finalizedBatchedActionHistory.push(action);
        }))

        return finalizedBatchedActionHistory;
    }

    static updateNewActionStartIndex(history: HistoryStateType){
        const updatedHistory: HistoryStateType = { ...history, newActionStartIndex: history.actionHistory.length };
        return updatedHistory
    }
}