import type { HistoryStateType } from "../contexts/historyContext";
import type Action from "./Action";
import type TreeNode from "./TreeNode";

export type NodeEntry = { userID: string, node: TreeNode };

export default class APIManager {
    constructor() { };

    static storeAddedNode(nodeEntries: NodeEntry[]) {
        const serializedNodeEntry = JSON.stringify(nodeEntries);
        fetch("/api/add_node", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: serializedNodeEntry
        })
    }

    static removeDeletedNode(nodeIDS: string[]) {
        fetch("/api/delete_node", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nodeIDS)
        })
    }

    static deduplicateHistory(history: HistoryStateType) {
        const deduplicatedHistory = {
            userID: history.userID,
            actionHistory: []
        } as HistoryStateType;

        const nodeIDToActionMap = new Map() as Map<string, Action>;

        history.actionHistory.forEach((action) => {
            action.targets.forEach((node) => {
                if (nodeIDToActionMap.has(node.id)) {
                    const olderAction = nodeIDToActionMap.get(node.id)!;
   
                    if ((olderAction.type == "delete" && action.type == "add") || (olderAction.type == "add" && action.type == "delete")) {
                        nodeIDToActionMap.delete(node.id);
                    }

                    else {
                        nodeIDToActionMap.delete(node.id);
                        nodeIDToActionMap.set(node.id, action); // keep in mind maps are sequential!
                    }                
                }

                else {
                    nodeIDToActionMap.set(node.id, action);
                }
            })
        })
  
        deduplicatedHistory.actionHistory =  Array.from(new Set(nodeIDToActionMap.values()));
        console.log("DEDUPLICATED: ", deduplicatedHistory.actionHistory);
        return deduplicatedHistory;
    }
}