import { createContext } from "react";
import type Action from "../model/Action";

export type HistoryContextType = [HistoryStateType, React.Dispatch<React.SetStateAction<HistoryStateType>>]
export type HistoryStateType =  {uuid: string, newActionStartIndex: number, actionHistory: Action[]};
export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);