import { useEffect } from "react";
import ContextManager from "../classes/ContextManager";
import type { HistoryContextType } from "../contexts/historyContext";
import type { TreeContextType } from "../contexts/treeContext";
import type { URLMapContextType } from "../contexts/urlMapContext";

export default function useLatestAction(history: HistoryContextType[0], tree: TreeContextType[0], setTree: TreeContextType[1], urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1]) {
    useEffect(() => {
        if (history.actionHistory.length > 0) {
            const latestAction = history.actionHistory[history.actionHistory.length - 1];
            if (latestAction.type == "add") {
                ContextManager.addNode(tree, setTree, latestAction.targets[0], urlMap, setURLMap);
            }

            else if (latestAction.type == "delete") {
                ContextManager.deleteNode(tree, setTree, latestAction.targets[0], urlMap, setURLMap);
            }

            // add update method here
        }

    }, [history])
}