import { createContext } from "react";
import type TreeNode from "../model/TreeNodeModel";
import type { TreeReducerAction } from "../reducers/treeReducer";

export type TreeContextType = [TreeStateType, React.ActionDispatch<[action: TreeReducerAction]>];
export type TreeStateType = Map<string, TreeNode>
export const TreeContext = createContext<TreeContextType | undefined>(undefined);