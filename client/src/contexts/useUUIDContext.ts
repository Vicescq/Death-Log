import { useContext } from "react";
import { UUIDContext } from "../contexts/uuidContext";

export default function useUUIDContext() {
    const uuidContext = useContext(UUIDContext);
    if (uuidContext === undefined) {
        throw new Error("DEVELOPMENT ERROR! MAKE SURE TO INSTANTIATE UUIDContext to be undefined in context.tsx!");
    }
    return uuidContext;
}