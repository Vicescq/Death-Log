import type TreeNode from "./TreeNode";

export type NodeEntry = {userID: string, node: TreeNode};

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

    static createNodeEntry(userID: string, node: TreeNode){
        return {
            userID,
        }
    }
}