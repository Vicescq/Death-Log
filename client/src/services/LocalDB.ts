import { db } from "../model/LocalDBSchema";
import type { DistinctTreeNode, Game, Profile, Subject } from "../model/TreeNodeModel";
import { assertIsNonNull } from "../utils";

export default class LocalDB {
    constructor() { }

    static async addNode(node: DistinctTreeNode, parentNode?: DistinctTreeNode) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.add({ node_id: node.id, node: node, email: LocalDB.getUserEmail(), created_at: new Date().toISOString(), edited_at: new Date().toISOString() });
            if (node.type != "game") {
                assertIsNonNull(parentNode);
                await db.nodes.update(parentNode.id, { node_id: parentNode.id, node: parentNode, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
            }
        })
    }

    static async deleteGame(ids: string[]) {
        await db.nodes.bulkDelete(ids);
    }

    static async deleteProfile(ids: string[], gameParent: Game) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.bulkDelete(ids);
            await db.nodes.update(gameParent.id, { node_id: gameParent.id, node: gameParent, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
        })
    }

    static async deleteSubject(ids: string[], gameParent: Game, profileParent: Profile) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.bulkDelete(ids);
            await db.nodes.update(gameParent.id, { node_id: gameParent.id, node: gameParent, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
            await db.nodes.update(profileParent.id, { node_id: profileParent.id, node: profileParent, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
        })
    }

    static async updateNodeLineage(subject: Subject, profile: Profile, game: Game) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.update(subject.id, { node_id: subject.id, node: subject, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
            await db.nodes.update(profile.id, { node_id: profile.id, node: profile, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
            await db.nodes.update(game.id, { node_id: game.id, node: game, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
        })
    }

    static async updateNodeAndParent(node: DistinctTreeNode, parentNode?: DistinctTreeNode) {
        db.transaction("rw", db.nodes, async () => {
            await db.nodes.update(node.id, { node_id: node.id, node: node, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
            if (node.type != "game") {
                assertIsNonNull(parentNode);
                await db.nodes.update(parentNode.id, { node_id: parentNode.id, node: parentNode, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
            }
        })
    }

    static async updateNode(node: DistinctTreeNode) {
        await db.nodes.update(node.id, { node_id: node.id, node: node, edited_at: new Date().toISOString(), email: LocalDB.getUserEmail() });
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
}