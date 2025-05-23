import { createContext } from "react";
import type TreeNode from "../classes/TreeNode";

export type TreeContextType = [TreeStateType, React.Dispatch<React.SetStateAction<TreeStateType>>];
export type TreeStateType = Map<string, TreeNode>
export const TreeContext = createContext<TreeContextType | undefined>(undefined);