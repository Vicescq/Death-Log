import type { TreeStateType } from "../contexts/treeContext";
import type { ActionUpdate } from "../model/Action";
import type { DistinctTreeNode } from "../model/TreeNodeModel";
import { createShallowCopyMap } from "./treeUtils";

export function updateDB(tree: TreeStateType) {
    const treeCopy = createShallowCopyMap(tree);
    treeCopy.delete("ROOT_NODE");
    const actions: ActionUpdate[] = [];
    treeCopy.forEach((node) => {
        const distinctNode = node as DistinctTreeNode; // for typing
        actions.push({ type: "update", targets: [distinctNode] });
    })
    return actions
}

export function migrateOldToNew(nodes: any[]){
    const nodesCopy = [...nodes];
    nodesCopy.forEach((node, index) => {
        const nodeCopy = {...node};
        Object.keys(nodeCopy).forEach((key) => {
            if (key == "date"){
                nodeCopy["dateStart"] = nodeCopy["date"];
                delete nodeCopy["date"];
            }
        })
        nodesCopy[index] = nodeCopy;
    })
    return nodesCopy;
}