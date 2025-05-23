import { type ReactNode, useState, useEffect } from "react";
import ContextManager from "../classes/ContextManager";
import RootNode from "../classes/RootNode";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import { type TreeStateType, TreeContext } from "./treeContext";
import { URLMapContext, type URLMapStateType } from "./urlMapContext";

export function ContextWrapper({ children }: { children: ReactNode }) {
    const [tree, setTree] = useState<TreeStateType>(new Map());
    const [urlMap, setURLMap] = useState<URLMapStateType>(new Map());

    useEffect(() => {
        const rootNode = new RootNode();
        ContextManager.addNode(tree, setTree, rootNode, urlMap, setURLMap);
    }, [])

    useConsoleLogOnStateChange(tree, "TREE: ", tree);
    useConsoleLogOnStateChange(urlMap, "URL MAP: ", urlMap);


    return (
        <TreeContext.Provider value={[tree, setTree]}>
            <URLMapContext.Provider value={[urlMap, setURLMap]}>
                {children}
            </URLMapContext.Provider>
        </TreeContext.Provider>
    )
}