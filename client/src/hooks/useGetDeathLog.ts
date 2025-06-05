import { useEffect } from "react";
import type { TreeContextType, TreeStateType } from "../contexts/treeContext";
import APIService from "../services/APIService";
import type { UUIDStateType } from "../contexts/uuidContext";

export default function useGetDeathLog(uuid: UUIDStateType, tree: TreeStateType, setTree: TreeContextType[1]) {
    useEffect(() => {
        if (uuid) {
            APIService.getDeathLog(uuid, tree, setTree);
        }
    }, [uuid])
}