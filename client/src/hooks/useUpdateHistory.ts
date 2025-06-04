import { useEffect } from "react";
import type { TreeStateType } from "../contexts/treeContext";
import Action from "../model/Action";
import type { HistoryContextType, HistoryStateType } from "../contexts/historyContext";
import { updateActionHistory } from "../utils/history";

export default function useUpdateHistory(tree: TreeStateType, intents: Action[], history: HistoryStateType, setHistory: HistoryContextType[1]) {
    const actionHistory: Action[] = [];
    useEffect(() => {
        if (intents.length > 0) {
            intents.forEach((action) => {
                if (action.type == "toBeUpdated") {
                    const nodeID = action.targets[0] as string
                    actionHistory.push(new Action("update", [tree.get(nodeID)!]))
                }

                else {
                    actionHistory.push(action);
                }
            })
            updateActionHistory(history, setHistory, actionHistory)
        }
    }, [tree, intents])
}