import type { URLMapStateType } from "../urlMapContext";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import { createShallowCopyMap } from "../../utils/general";
import type { TreeStateType } from "../treeContext";

export default class URLMapContextManager {
    constructor() { }

    static initURLMap(mappingArray: { path: string, node_id: string }[]) {
        const newURLMap: URLMapStateType = new Map();
        mappingArray.forEach((mapping) => {
            newURLMap.set(mapping.path, mapping.node_id);
        })
        return newURLMap;
    }

    static addURL(urlMap: URLMapStateType, node: DistinctTreeNode) {
        const urlMapCopy = createShallowCopyMap(urlMap);
        urlMapCopy.set(node.path, node.id);
        return urlMapCopy;
    }

    static deleteURL(urlMap: URLMapStateType, toBeDeletedNodeIDS: string[]) {
        const urlMapCopy = createShallowCopyMap(urlMap);
        urlMapCopy.forEach((nodeID, path) => {
            if (toBeDeletedNodeIDS.includes(nodeID)) {
                urlMapCopy.delete(path);
            }
        })
        return urlMapCopy;
    }

    static updateURL(urlMap: URLMapStateType, tree: TreeStateType, oldPath: string, newPath: string, node: DistinctTreeNode) {
        const urlMapCopy = createShallowCopyMap(urlMap);
        urlMapCopy.delete(oldPath);
        urlMapCopy.set(newPath, node.id);
        if (node.type == "game") {
            node.childIDS.forEach((id) => {
                const currNode = tree.get(id);
                let splittedStr = currNode?.path.split("/");
                if (splittedStr != undefined){
                    splittedStr[0] = newPath;

                    
                    const finalStr = splittedStr.join();
                }
            })
        }
        
        return urlMapCopy
    }
}
