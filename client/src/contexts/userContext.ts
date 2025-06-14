import type { User } from "firebase/auth";
import { createContext } from "react";

export type UserStateType = User | null | "__LOCAL__";
export type UserContextType = [UserStateType, React.Dispatch<React.SetStateAction<UserStateType>>];
export const UserContext = createContext<UserContextType | undefined>(undefined);