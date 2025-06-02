import { useEffect } from "react";
import type { TreeContextType } from "../contexts/treeContext";
import type { URLMapContextType } from "../contexts/urlMapContext";
import APIService from "../services/APIService";

export default function useGetDeathLog(uuid: string | undefined | null, setTree: TreeContextType[1], setURLMap: URLMapContextType[1]){
    useEffect(() => {
        if (uuid){
            APIService.getDeathLog(uuid, setTree, setURLMap);
        }
    }, [uuid])
}