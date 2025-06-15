import type { TreeStateType } from "../contexts/treeContext";
import type { URLMapContextType, URLMapStateType } from "../contexts/urlMapContext";
import type { DistinctTreeNode, TangibleTreeNodeParent } from "../model/TreeNodeModel";
import { createShallowCopyMap } from "../utils/general";

export default class URLMapContextManager {
    constructor() { }

    static initURLMap(mappingArray: {path: string, node_id: string}[]){
        // assume paths -> nodeIDS map naturally
        const newURLMap: URLMapStateType = new Map();
        mappingArray.forEach((mapping) => {
            newURLMap.set(mapping.path, mapping.node_id);
        })
        return newURLMap;
    }

    static addURL(urlMap: URLMapStateType, node: TangibleTreeNodeParent){
        const urlMapCopy = createShallowCopyMap(urlMap);
        urlMapCopy.set(node.path, node.id);
        return urlMapCopy;
    }

    static deleteURL(urlMap: URLMapStateType, toBeDeletedNodeIDS: string[]){
        const urlMapCopy = createShallowCopyMap(urlMap);
        urlMapCopy.forEach((nodeID, path) => {
            if (toBeDeletedNodeIDS.includes(nodeID)){
                urlMapCopy.delete(path);
            }
        })
        return urlMapCopy;
    }
}



//**
// 
// export default function useUpdateURLMap(tree: TreeStateType, urlMap: URLMapStateType, setURLMap: URLMapContextType[1]) {
//     useEffect(() => {
//         const urlMapCopy = createShallowCopyMap(urlMap);
//         const existingNodeIDS: string[] = [];

//         // add new nodes to url map
//         tree.forEach((node) => {
//             if (node.type != "subject" && node.type != "ROOT_NODE") {
//                 const tangibleNodeParent = node as TangibleTreeNodeParent;
//                 existingNodeIDS.push(tangibleNodeParent.id);
//                 if (!urlMapCopy.has(tangibleNodeParent.path)) {
//                     urlMapCopy.set(tangibleNodeParent.path, tangibleNodeParent.id);
//                 }
//             }
//         })
        
//         // delete non existing nodes from url map
//         urlMap.forEach((nodeID, path) => {
//             if (existingNodeIDS.find((treeNodeID) => nodeID == treeNodeID) == undefined) {
//                 urlMapCopy.delete(path);
//             }
//         })
//         setURLMap(urlMapCopy)
//     }, [tree])
// }
// 
// 
//  */