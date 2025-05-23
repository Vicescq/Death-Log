import { useContext } from "react";
import { TreeContext } from "../context";

export default function useTreeContext() {
    const treeContext = useContext(TreeContext);
    if (treeContext === undefined) {
        throw new Error("DEVELOPMENT ERROR! MAKE SURE TO INSTANTIATE TreeContext to be undefined in context.tsx!");
    }
    return treeContext;
}