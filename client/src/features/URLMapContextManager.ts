import type { URLMapStateType } from "../contexts/urlMapContext";
import type { TangibleTreeNodeParent } from "../model/TreeNodeModel";
import { createShallowCopyMap } from "../utils/general";

export default class URLMapContextManager {
    constructor() { }

    static initURLMap(mappingArray: { path: string, node_id: string }[]) {
        const newURLMap: URLMapStateType = new Map();
        mappingArray.forEach((mapping) => {
            newURLMap.set(mapping.path, mapping.node_id);
        })
        return newURLMap;
    }

    static addURL(urlMap: URLMapStateType, node: TangibleTreeNodeParent) {
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
}