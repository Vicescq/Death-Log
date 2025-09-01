import { db } from "../model/IndexedDBSchema";
import type { DistinctTreeNode, Game, Profile, Subject } from "../model/TreeNodeModel";
import { assertIsNonNull } from "../utils";

export default class IndexedDBService {
    constructor() { }

    static async addNode(node: DistinctTreeNode, email: string, parentNode?: DistinctTreeNode) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.add({ email: email, node_id: node.id, node: node, created_at: new Date().toISOString(), edited_at: new Date().toISOString() });
            if (node.type != "game") {
                assertIsNonNull(parentNode);
                await db.nodes.update(parentNode.id, { email: email, node_id: parentNode.id, node: parentNode, edited_at: new Date().toISOString() });
            }
        })
    }

    static async deleteGame(ids: string[]) {
        await db.nodes.bulkDelete(ids);
    }

    static async deleteProfile(ids: string[], gameParent: Game, email: string) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.bulkDelete(ids);
            await db.nodes.update(gameParent.id, { email: email, node_id: gameParent.id, node: gameParent, edited_at: new Date().toISOString() });
        })
    }

    static async deleteSubject(ids: string[], gameParent: Game, profileParent: Profile, email: string) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.bulkDelete(ids);
            await db.nodes.update(gameParent.id, { email: email, node_id: gameParent.id, node: gameParent, edited_at: new Date().toISOString() });
            await db.nodes.update(profileParent.id, { email: email, node_id: profileParent.id, node: profileParent, edited_at: new Date().toISOString() });
        })
    }

    static async updateNodeLineage(subject: Subject, profile: Profile, game: Game, email: string) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.update(subject.id, { email: email, node_id: subject.id, node: subject, edited_at: new Date().toISOString() });
            await db.nodes.update(profile.id, { email: email, node_id: profile.id, node: profile, edited_at: new Date().toISOString() });
            await db.nodes.update(game.id, { email: email, node_id: game.id, node: game, edited_at: new Date().toISOString() });
        })
    }

    static async updateNodeAndParent(node: DistinctTreeNode, email: string, parentNode?: DistinctTreeNode) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.update(node.id, { email: email, node_id: node.id, node: node, edited_at: new Date().toISOString() });
            if (node.type != "game") {
                assertIsNonNull(parentNode);
                await db.nodes.update(parentNode.id, { email: email, node_id: parentNode.id, node: parentNode, edited_at: new Date().toISOString() });
            }
        })
    }

    static async updateNode(node: DistinctTreeNode, email: string) {
        await db.nodes.update(node.id, { email: email, node_id: node.id, node: node, edited_at: new Date().toISOString() });
    }

    static async getNodes(email: string) {
        const rows = await db.nodes.where("email").equals(email).toArray();
        const nodes = rows.map((node) => { return node.node });
        return nodes;
    }
}