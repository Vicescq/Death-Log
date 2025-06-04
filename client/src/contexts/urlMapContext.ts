import { createContext } from "react";

export type URLMapContextType = [URLMapStateType, React.Dispatch<React.SetStateAction<URLMapStateType>>]
export type URLMapStateType = Map<string, string>;
export const URLMapContext = createContext<URLMapContextType | undefined>(undefined);