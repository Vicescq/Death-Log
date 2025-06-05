// export default function migrateAllToDB(tree: TreeStateType) {
//     const actions: Action[] = [];
//     tree.forEach((node) => {
//         actions.push(new Action("update", [node]));
//     })
//     console.log(actions)
//     return actions
// }

import type { DistinctTreeNode } from "../model/TreeNodeModel";

export function convertOldModelToNew(resValues: { [id: string]: any }[]) {
    const convertedNodes: DistinctTreeNode[] = [];
    // resValues.forEach((resValue, index) => {
    //     const nodeID = Object.keys(resValue)[0];
    //     const node = Object.keys(resValue[nodeID])
    //     node.forEach((key, index) => {
    //         node[index] = key.slice(1);
            
    //     })
    //     // resValue[nodeID] = node
    // })
    // console.log(resValues)
    return convertedNodes;
}