import type {  HistoryStateType } from "../contexts/historyContext";
import type { Action } from "../model/Action";

export function updateActionHistory(history: HistoryStateType, actions: Action[]) {
    return { ...history, actionHistory: [...history.actionHistory, ...actions] } as HistoryStateType;
}