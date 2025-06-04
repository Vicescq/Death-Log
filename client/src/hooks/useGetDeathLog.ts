import { useEffect } from "react";
import type { TreeContextType } from "../contexts/treeContext";
import APIService from "../services/APIService";
import type { UUIDStateType } from "../contexts/uuidContext";

export default function useGetDeathLog(uuid: UUIDStateType, dispatchTree: TreeContextType[1]) {
    useEffect(() => {
        if (uuid) {
            APIService.getDeathLog(uuid, dispatchTree);
        }
    }, [uuid])
}