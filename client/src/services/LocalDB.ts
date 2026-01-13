import { db } from "../model/LocalDBSchema";
import type { DistinctTreeNode } from "../model/TreeNodeModel";
import { assertIsNonNull } from "../utils";

export default class LocalDB {
    constructor() { }

    static async addNode(node: DistinctTreeNode, parentNode?: DistinctTreeNode) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.add({ node_id: node.id, node: node, email: LocalDB.getUserEmail(), created_at: new Date().toISOString(), edited_at: new Date().toISOString() });
            if (node.type != "game" && parentNode) {
                await db.nodes.update(parentNode.id, { node_id: parentNode.id, node: parentNode, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
            }
        })
    }

    static async deleteNode(ids: string[], parentNode?: DistinctTreeNode) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.bulkDelete(ids);
            if (parentNode) {
                await db.nodes.update(parentNode.id, { node_id: parentNode.id, node: parentNode, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
            }
        })
    }

    static async updateNode(node: DistinctTreeNode, parentNode?: DistinctTreeNode) {
        await db.nodes.update(node.id, { node_id: node.id, node: node, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
        if (parentNode) {
            await db.nodes.update(parentNode.id, { node_id: parentNode.id, node: parentNode, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
        }
    }

    static async getNodes() {
        const rows = await db.nodes.where("email").equals(LocalDB.getUserEmail()).toArray();
        const nodes = rows.map((node) => { return node.node });
        return nodes;
    }

    static incrementCRUDCounter() {
        const prev = localStorage.getItem(`DEATHLOG_CRUD_COUNTER-${LocalDB.getUserEmail()}`);
        let current;
        if (prev) {
            current = Number(prev) + 1
        }
        else {
            current = 1
        }
        localStorage.setItem(`DEATHLOG_CRUD_COUNTER-${LocalDB.getUserEmail()}`, String(current))
    }

    static getUserEmail() {
        const email = localStorage.getItem("email");
        assertIsNonNull(email);
        return email;
    }

    static setUserEmail(email: string) {
        localStorage.setItem("email", email);
    }

    static async clearData() {
        await db.nodes.where("email").equals(LocalDB.getUserEmail()).delete();
    }

    static async insertData(nodes: DistinctTreeNode[]) {
        for (let node of nodes) {
            await db.nodes.add({ node_id: node.id, email: LocalDB.getUserEmail(), node: node, created_at: new Date().toISOString(), edited_at: new Date().toISOString() })
        }
    }

    static async clearAndInsertData(nodes: DistinctTreeNode[]) {
        await db.transaction("rw", db.nodes, async () => {
            await LocalDB.clearData();
            await LocalDB.insertData(nodes);
        })
    }
}