import { createContext } from "react";

export const CurrentHistoryIndexContext = createContext<React.RefObject<number> | undefined>(undefined);