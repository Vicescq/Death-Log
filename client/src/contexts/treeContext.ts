import { createContext } from "react";
import type { TreeNode } from "../model/TreeNodeModel";
import type { Action } from "../model/Action";

export type TreeContextType = [TreeStateType, React.ActionDispatch<[action: Action]>];
export type TreeStateType = Map<string, TreeNode>
export const TreeContext = createContext<TreeContextType | undefined>(undefined);