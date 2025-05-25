import type TreeNode from "./TreeNode";

export default class APIManager {
    constructor() { };

    static storeAddedNode(node: TreeNode) {
        fetch("/api/add_node", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({[node.id]: node})
        })
    }

    static removeDeletedNode(node: TreeNode) {
        fetch("/api/delete_node", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({[node.id]: node})
        })
    }
}