import { db } from "../db";
import type { DistinctTreeNode, TangibleTreeNodeParent } from "../model/TreeNodeModel";

export default class IndexedDBService {
    constructor() { }

    static async addNode(node: DistinctTreeNode, email: string) {
        await db.nodes.add({ email: email, node_id: node.id, node: node });
    }

    static async deleteNode(ids: string[]) {
        await db.nodes.bulkDelete(ids);
    }

    static async updateNode(node: DistinctTreeNode, email: string) {
        await db.nodes.update(node.id, {email: email, node_id: node.id, node: node});
    }

    static async getNodes(email: string) {
        const rows = await db.nodes.where("email").equals(email).toArray();
        const nodes = rows.map((node) => { return node.node });
        return nodes;
    }

    static async addURL(node: TangibleTreeNodeParent, email: string) {
        await db.urlMaps.add({ node_id: node.id, email: email, mapping: { path: node.path, node_id: node.id } });
    }

    static async deleteURLS(ids: string[]) {
        await db.urlMaps.bulkDelete(ids);
    }

    static async getURLMappings(email: string) {
        const rows = await db.urlMaps.where("email").equals(email).toArray();
        const urlMappings = rows.map((urlMapping) => { return urlMapping.mapping });
        return urlMappings;
    }
}