import { useEffect } from "react";
import APIManager from "../classes/APIManager"
import type { TreeContextType } from "../contexts/treeContext";
import type { URLMapContextType } from "../contexts/urlMapContext";

export default function useLoadDeathLog(uuid: string | undefined | null, setTree: TreeContextType[1], setURLMap: URLMapContextType[1]){
    useEffect(() => {
        if (uuid){
            APIManager.getDeathLog(uuid, setTree, setURLMap);
        }
    }, [uuid])
}