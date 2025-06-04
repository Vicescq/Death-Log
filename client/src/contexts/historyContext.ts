import { createContext } from "react";
import type Action from "../model/Action";

export type HistoryContextType = [HistoryStateType, React.ActionDispatch<[action: Action]>]
export type HistoryStateType =  {newActionStartIndex: number, actionHistory: Action[]};
export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);