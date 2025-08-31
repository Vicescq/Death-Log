import { db } from "../model/IndexedDBSchema";
import type { DistinctTreeNode, Game, Profile, Subject, TreeNode } from "../model/TreeNodeModel";
import { assertIsNonNull } from "../utils";

export default class IndexedDBService {
    constructor() { }

    static async addNode(node: DistinctTreeNode, email: string, parentNode?: DistinctTreeNode) {
        await db.nodes.add({ email: email, node_id: node.id, node: node, created_at: new Date().toISOString(), edited_at: new Date().toISOString() });
        if (node.type != "game") {
            assertIsNonNull(parentNode);
            await db.nodes.update(parentNode.id, { email: email, node_id: parentNode.id, node: parentNode, edited_at: new Date().toISOString() });
        }
    }

    static async deleteNode(ids: string[], node: DistinctTreeNode, email: string, parentNode?: DistinctTreeNode) {
        await db.nodes.bulkDelete(ids); // deletes self and children
        if (node.type != "game") {
            assertIsNonNull(parentNode);
            await db.nodes.update(parentNode.id, { email: email, node_id: parentNode.id, node: parentNode, edited_at: new Date().toISOString() }); // updated death count and sorted childIDs
        }
    }

    static async updateNodeLineage(subject: Subject, profile: Profile, game: Game, email: string) {
        await db.nodes.update(subject.id, { email: email, node_id: subject.id, node: subject, edited_at: new Date().toISOString() });
        await db.nodes.update(profile.id, { email: email, node_id: profile.id, node: profile, edited_at: new Date().toISOString() });
        await db.nodes.update(game.id, { email: email, node_id: game.id, node: game, edited_at: new Date().toISOString() });
    }

    static async updateNodeAndParent(node: DistinctTreeNode, email: string, parentNode?: DistinctTreeNode) {
        await db.nodes.update(node.id, { email: email, node_id: node.id, node: node, edited_at: new Date().toISOString() });
        if (node.type != "game") {
            assertIsNonNull(parentNode);
            await db.nodes.update(parentNode.id, { email: email, node_id: parentNode.id, node: parentNode, edited_at: new Date().toISOString() });
        }
    }

    static async getNodes(email: string) {
        const rows = await db.nodes.where("email").equals(email).toArray();
        const nodes = rows.map((node) => { return node.node });
        return nodes;
    }
}