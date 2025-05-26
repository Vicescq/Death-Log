import { createContext } from "react";
import type Action from "../classes/Action";

export type HistoryContextType = [HistoryStateType, React.Dispatch<React.SetStateAction<HistoryStateType>>]
export type HistoryStateType =  {userID: string, actionHistory: Action[]};
export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);