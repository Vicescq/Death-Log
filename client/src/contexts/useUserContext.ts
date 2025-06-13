import { useContext } from "react";
import { UserContext } from "./userContext";

export default function useUserContext() {
    const userContext = useContext(UserContext);
    if (userContext === undefined) {
        throw new Error("DEVELOPMENT ERROR! MAKE SURE TO INSTANTIATE UserContext to be undefined in context.tsx!");
    }
    return userContext;
}