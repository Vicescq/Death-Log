import { useEffect } from "react";
import type { TreeStateType } from "../contexts/treeContext";
import type { URLMapContextType, URLMapStateType } from "../contexts/urlMapContext";
import type { TangibleTreeNodeParent } from "../model/TreeNodeModel";
import { createShallowCopyMap } from "../utils/general";

export default function useUpdateURLMap(tree: TreeStateType, urlMap: URLMapStateType, setURLMap: URLMapContextType[1]) {
    useEffect(() => {
        const urlMapCopy = createShallowCopyMap(urlMap);
        const existingNodeIDS: string[] = [];

        // add new nodes to url map
        tree.forEach((node) => {
            if (node.type != "subject" && node.type != "ROOT_NODE") {
                const tangibleNodeParent = node as TangibleTreeNodeParent;
                existingNodeIDS.push(tangibleNodeParent.id);
                if (!urlMapCopy.has(tangibleNodeParent.path)) {
                    urlMapCopy.set(tangibleNodeParent.path, tangibleNodeParent.id);
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