import { useEffect } from "react";
import type { TreeContextType } from "../contexts/treeContext";
import type { URLMapContextType } from "../contexts/urlMapContext";
import APIManager from "../services/APIManager";

export default function useGetDeathLog(uuid: string | undefined | null, setTree: TreeContextType[1], setURLMap: URLMapContextType[1]){
    useEffect(() => {
        if (uuid){
            APIManager.getDeathLog(uuid, setTree, setURLMap);
        }
    }, [uuid])
}