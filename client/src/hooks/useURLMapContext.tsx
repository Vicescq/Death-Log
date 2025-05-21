import { useContext } from "react";
import { URLMapContext } from "../context";


export default function useURLMapContext() {
    const urlMapContext = useContext(URLMapContext);
    if (urlMapContext === undefined) {
        throw new Error("DEVELOPMENT ERROR! MAKE SURE TO INSTANTIATE URLMapContext to be undefined in context.tsx!");
    }
    return urlMapContext;
}