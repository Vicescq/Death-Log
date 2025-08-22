import { db } from "../model/IndexedDBSchema";
import type { DistinctTreeNode, TreeNode } from "../model/TreeNodeModel";

export default class IndexedDBService {
    constructor() { }

    static async addNode(node: TreeNode, email: string, parentNode: TreeNode) {
        await db.nodes.add({ email: email, node_id: node.id, node: node, created_at: new Date().toISOString() });
        if (node.type != "game"){
            await IndexedDBService.updateNode(parentNode, email);            
        }
    }

    static async deleteNode(ids: string[], node: TreeNode, email: string, parentNode: TreeNode) {
        await db.nodes.bulkDelete(ids);
        if (node.type != "game"){
            await IndexedDBService.updateNode(parentNode, email);            
        }
    }

    static async updateNode(node: TreeNode, email: string) {
        await db.nodes.update(node.id, { email: email, node_id: node.id, node: node });
        
    }

    static async getNodes(email: string) {
        const rows = await db.nodes.where("email").equals(email).toArray();
        const nodes = rows.map((node) => { return node.node });
        return nodes;
    }
}