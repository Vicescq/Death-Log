import { createContext, useEffect, useState, type ReactNode } from "react";
import type TreeNode from "./classes/TreeNode";
import RootNode from "./classes/RootNode";
import ContextManager from "./classes/ContextManager";
import useConsoleLogOnStateChange from "./hooks/useConsoleLogOnStateChange";

export type TreeContextType = [TreeStateType, React.Dispatch<React.SetStateAction<TreeStateType>>];
export type TreeStateType = Map<string, TreeNode>
export const TreeContext = createContext<TreeContextType | undefined>(undefined);

export type URLMapContextType = [URLMapStateType, React.Dispatch<React.SetStateAction<URLMapStateType>>]
export type URLMapStateType = Map<string, URLMapStateValueType>;
export type URLMapStateValueType = {
    gameID: string,
    profileID: string,
    subjectID: string
}
export const URLMapContext = createContext<URLMapContextType | undefined>(undefined);

export function ContextWrapper({ children }: { children: ReactNode }) {
    const [tree, setTree] = useState<TreeStateType>(new Map());


    useEffect(() => {
        const rootNode = new RootNode();
        ContextManager.addNode(tree, setTree, rootNode);
    }, [])

    useConsoleLogOnStateChange(tree, "TREE: ", tree);
    const [urlMap, setURLMap] = useState<URLMapStateType>(new Map());

    return (
        <TreeContext.Provider value={[tree, setTree]}>


            {children}


        </TreeContext.Provider>
    )
}