import { useEffect } from "react";
import type { TreeContextType } from "../contexts/treeContext";
import type { URLMapContextType } from "../contexts/urlMapContext";
import APIService from "../services/APIService";
import type { UUIDContextType, UUIDStateType } from "../contexts/uuidContext";

export default function useGetDeathLog(uuid: UUIDStateType, dispatchTree: TreeContextType[1]) {
    useEffect(() => {
        if (uuid) {
            APIService.getDeathLog(uuid, dispatchTree);
        }
    }, [uuid])
}