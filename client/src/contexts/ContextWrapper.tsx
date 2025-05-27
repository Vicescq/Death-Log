import { type ReactNode, useState, useEffect, useRef } from "react";
import ContextManager from "../classes/ContextManager";
import RootNode from "../classes/RootNode";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import { type TreeStateType, TreeContext } from "./treeContext";
import { URLMapContext, type URLMapStateType } from "./urlMapContext";
import { useAuth } from "@clerk/clerk-react";
import { HistoryContext, type HistoryStateType } from "./historyContext";
import useLoadUserID from "../hooks/useLoadUserID";
import { CurrentHistoryIndexContext } from "./currentHistoryIndexContext";

export function ContextWrapper({ children }: { children: ReactNode }) {
    const { isLoaded, userId } = useAuth();

    const [tree, setTree] = useState<TreeStateType>(new Map());
    const [urlMap, setURLMap] = useState<URLMapStateType>(new Map());

    const initHistory = { userID: userId, actionHistory: [] } as HistoryStateType;
    const [history, setHistory] = useState<HistoryStateType>(initHistory);

    const currentHistoryIndexRef = useRef(history.actionHistory.length);

    useEffect(() => {
        const rootNode = new RootNode();
        ContextManager.addNode(tree, setTree, rootNode, urlMap, setURLMap);
    }, [])

    useLoadUserID(isLoaded, userId, history, setHistory);

    useConsoleLogOnStateChange(tree, "TREE: ", tree);
    // useConsoleLogOnStateChange(urlMap, "URL MAP: ", urlMap);
    useConsoleLogOnStateChange(history, "HISTORY: ", history);
    // useConsoleLogOnStateChange(history, "\nSANITIZED: ", APIManager.deduplicateHistory(history));
    useConsoleLogOnStateChange(currentHistoryIndexRef.current, "INDEX:", currentHistoryIndexRef.current);

    if (isLoaded && (userId != undefined)) {
        return (
            <TreeContext.Provider value={[tree, setTree]}>
                <URLMapContext.Provider value={[urlMap, setURLMap]}>
                    <HistoryContext.Provider value={[history, setHistory]}>
                        <CurrentHistoryIndexContext.Provider value={currentHistoryIndexRef}>
                            {children}
                        </CurrentHistoryIndexContext.Provider>
                    </HistoryContext.Provider>
                </URLMapContext.Provider>
            </TreeContext.Provider>
        )
    }

    else {
        return (<div>USER LOADING...</div>)
    }
}