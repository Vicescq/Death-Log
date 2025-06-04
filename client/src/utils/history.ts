import type { HistoryContextType } from "../contexts/historyContext";
import type Action from "../model/Action";

export function updateActionHistory(history: HistoryContextType[0], setHistory: HistoryContextType[1], actions: Action[]) {
    const updatedHistory = { ...history };
    actions.forEach((action) => updatedHistory.actionHistory.push(action));
    setHistory(updatedHistory);
}