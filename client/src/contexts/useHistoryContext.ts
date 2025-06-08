import { useContext } from "react";
import { HistoryContext } from "../contexts/historyContext";

export default function useHistoryContext() {
    const historyContext = useContext(HistoryContext);
    if (historyContext === undefined) {
        throw new Error("DEVELOPMENT ERROR! MAKE SURE TO INSTANTIATE HistoryContext to be undefined in context.tsx!");
    }
    return historyContext;
}