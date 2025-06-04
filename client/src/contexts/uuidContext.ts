import { createContext } from "react";

export type UUIDContextType = [UUIDStateType, React.Dispatch<React.SetStateAction<string | null | undefined>>];
export type UUIDStateType = string | null | undefined;
export const UUIDContext = createContext<UUIDContextType | undefined>(undefined);