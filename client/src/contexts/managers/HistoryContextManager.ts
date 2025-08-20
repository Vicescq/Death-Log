import type { HistoryStateType } from "../historyContext";
import type { Action } from "../../model/Action";
import { v4 as uuid4 } from "uuid";
import type { DistinctTreeNode, TreeNode } from "../../model/TreeNodeModel";

export default class HistoryContextManager {
    static updateActionHistory(history: HistoryStateType, actions: Action[]) {
        return { ...history, actionHistory: [...history.actionHistory, ...actions] } as HistoryStateType;
    }

    static batchHistory(history: HistoryStateType) {
        const historyCopy = {...history};
        const batchedActionHistory = historyCopy.actionHistory.slice(historyCopy.newActionStartIndex);
        const deduplicatedUpdateActions = new Map<(string | string[]), Action>();
        const finalizedBatchedActionHistory: Action[] = [];
        batchedActionHistory.reverse();
        batchedActionHistory.forEach((action) => {
            if (action.type == "update") {
                const node = action.targets as TreeNode;
                !deduplicatedUpdateActions.has(node.id) ? deduplicatedUpdateActions.set(node.id, action) : null;
            }
            else {
                deduplicatedUpdateActions.set("__PLACEHOLDER__" + uuid4(), action);
            }
        })

        Array.from(deduplicatedUpdateActions.entries()).reverse().forEach((([_, action]) => {
            finalizedBatchedActionHistory.push(action);
        }))
        historyCopy.actionHistory = finalizedBatchedActionHistory;
        return historyCopy;
    }

    static updateNewActionStartIndex(history: HistoryStateType){
        const updatedHistory: HistoryStateType = { ...history, newActionStartIndex: history.actionHistory.length };
        return updatedHistory
    }

    static filterAffectedNodes(history: HistoryStateType){
        const addedNodes: DistinctTreeNode[] = [];
        const deletedNodes: string[][] = [];
        const updatedNodes: DistinctTreeNode[] = [];
        history.actionHistory.forEach((action) => {
            switch(action.type){
                case "add":
                    addedNodes.push(action.targets);
                    break;
                case "delete":
                    deletedNodes.push(action.targets);
                    break;
                default:
                    updatedNodes.push(action.targets);
            }
        })
        return {addedNodes, deletedNodes, updatedNodes};
    }
}