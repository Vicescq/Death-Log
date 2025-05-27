import { useContext } from "react";
import { CurrentHistoryIndexContext } from "../contexts/currentHistoryIndexContext";

export default function useCurrentHistoryIndex() {
    const currentHistoryIndexContext = useContext(CurrentHistoryIndexContext);
    if (currentHistoryIndexContext === undefined) {
        throw new Error("DEVELOPMENT ERROR! MAKE SURE TO INSTANTIATE CurrentHistoryIndexContext to be undefined in context.tsx!");
    }
    return currentHistoryIndexContext;
}