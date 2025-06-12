import { db } from "../db";
import type { Action, ActionAdd, ActionDelete } from "../model/Action";

export default class IndexedDBService {
    constructor() { }

    static async addNode(action: ActionAdd, email: string) {
        const addedNode = action.targets[0]
        await db.nodes.add({ email: email, node_id: addedNode.id, node: addedNode });
    }

    static async deleteNodes(action: ActionDelete, uuid: string) {
        const ids = action.targets as "node_id"[];
        await db.nodes.bulkDelete(ids);
    }

    static async updateNode(action: Action, uuid: string) {

    }
}