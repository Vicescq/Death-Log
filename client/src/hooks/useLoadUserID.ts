import { useEffect } from "react";
import type { UUIDContextType, UUIDStateType } from "../contexts/uuidContext";

export default function useLoadUserID(isLoaded: boolean, userId: UUIDStateType, setUUID: UUIDContextType[1]) {
    useEffect(() => {
        if (isLoaded && userId) {
            setUUID(userId);
        }
    }, [isLoaded, userId])
}