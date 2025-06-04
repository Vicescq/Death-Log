import { createContext } from "react";
import type Action from "../model/Action";

export type URLMapContextType = [URLMapStateType, React.ActionDispatch<[action: Action]>]
export type URLMapStateType = Map<string, string>;
export const URLMapContext = createContext<URLMapContextType | undefined>(undefined);