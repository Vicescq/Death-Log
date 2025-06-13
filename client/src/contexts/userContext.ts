import type { User } from "firebase/auth";
import { createContext } from "react";

export type UserContextType = [User | null, React.Dispatch<React.SetStateAction<User | null>>];
export const UserContext = createContext<UserContextType | undefined>(undefined);