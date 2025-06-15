import type { URLMapStateType } from "../contexts/urlMapContext";
import { db } from "../db";
import type { Action, ActionAdd, ActionDelete, ActionUpdate } from "../model/Action";
import type { DistinctTreeNode, TangibleTreeNodeParent } from "../model/TreeNodeModel";

export default class IndexedDBService {
    constructor() { }

    static async addNode(node: DistinctTreeNode, email: string) {
        await db.nodes.add({ email: email, node_id: node.id, node: node });
    }

    static async deleteNodes(action: ActionDelete, email: string) {
        const ids = action.targets as "node_id"[];
        await db.nodes.bulkDelete(ids);
    }

    static async updateNode(action: ActionUpdate, email: string) {

    }

    static async getNodes(email: string) {
        const rows = await db.nodes.where("email").equals(email).toArray();
        const nodes = rows.map((node) => { return node.node });
        return nodes;
    }

    static async addURL(node: TangibleTreeNodeParent, email: string) {
        await db.urlMaps.add({ email: email, mapping: { path: node.path, node_id: node.id } });
    }

    static async getURLMappings(email: string) {
        const rows = await db.urlMaps.where("email").equals(email).toArray();
        const urlMappings = rows.map((urlMapping) => { return urlMapping.mapping });
        return urlMappings;
    }
}