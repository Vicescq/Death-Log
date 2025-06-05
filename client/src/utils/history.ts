import type { HistoryContextType, HistoryStateType } from "../contexts/historyContext";
import type { Action } from "../model/Action";

export function updateActionHistory(history: HistoryStateType, setHistory: HistoryContextType[1], actions: Action[]) {
    let updatedHistory: HistoryStateType;
    updatedHistory = { ...history, actionHistory: [...history.actionHistory, ...actions] };
    setHistory(updatedHistory);
}