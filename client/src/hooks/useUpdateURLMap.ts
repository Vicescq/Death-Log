import { useEffect } from "react";
import type { TreeStateType } from "../contexts/treeContext";
import type { URLMapContextType, URLMapStateType } from "../contexts/urlMapContext";
import { createShallowCopyMap } from "../utils/tree";


export default function useUpdateURLMap(tree: TreeStateType, urlMap: URLMapStateType, setURLMap: URLMapContextType[1]) {
    useEffect(() => {
        const urlMapCopy = createShallowCopyMap(urlMap);
        const existingNodeIDS: string[] = [];

        // add new nodes to url map
        tree.forEach((node) => {
            if (node.type != "subject" && node.type != "ROOT_NODE") {
                existingNodeIDS.push(node.id);
                if (!urlMapCopy.has(node.path)) {
                    urlMapCopy.set(node.path, node.id);
                }
            }
        })

        // delete non existing nodes from url map
        urlMap.forEach((nodeID, path) => {
            if (existingNodeIDS.find((treeNodeID) => nodeID == treeNodeID) == undefined) {
                urlMapCopy.delete(path);
            }
        })
        setURLMap(urlMapCopy)
    }, [tree])
}