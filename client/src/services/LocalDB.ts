import type { AddEvent } from "../model/EventModel";
import { db, type StateEntry } from "../model/LocalDBSchema";
import type { DistinctTreeNode, Game, Profile, Subject } from "../model/TreeNodeModel";
import { assertIsGame, assertIsNonNull, assertIsProfile } from "../utils";
import { v4 as uuidv4 } from 'uuid';

export default class LocalDB {
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

    static getUserEmail() {
        const email = localStorage.getItem("email");
        assertIsNonNull(email);
        return email;
    }

    static setUserEmail(email: string) {
        localStorage.setItem("email", email);
    }

    static async getEventStateHistory() {
        return await db.eventStateHistory.where("email").equalsIgnoreCase(LocalDB.getUserEmail()).toArray();
    }

    static async setEventStateHistory() {

    }

    static async updateEventState() {
        const eventState = { id: uuidv4(), email: LocalDB.getUserEmail(), created_at: new Date().toISOString(), created_at_INT: new Date().getTime() }
        db.transaction("rw", db.currentEventState, async () => {
            const currentEventState = await db.currentEventState.where("email").equalsIgnoreCase(LocalDB.getUserEmail()).first();
            if (currentEventState) {
                await db.currentEventState.delete(currentEventState.id)
            }
            db.currentEventState.add(eventState);
        })
        db.eventStateHistory.add(eventState);
    }

    static async getEvents() {
        return await db.events.where("email").equalsIgnoreCase(LocalDB.getUserEmail()).toArray()
    }

    static async clearEvents() {

    }

    static async handleEventStateUpdate() {
        const events = await LocalDB.getEvents();
        if(events.length == 0){
            await LocalDB.updateEventState();
        }
    }

    static async createAddEvent(addedNode: DistinctTreeNode, email: string, parent?: Game | Profile) {
        let event: AddEvent;
        switch (addedNode.type) {
            case "game":
                event = { data: addedNode, type: "add" };
                break;
            case "profile":
                assertIsNonNull(parent)
                assertIsGame(parent)
                event = { data: addedNode, type: "add", sideEffects: { updatedParent: parent } };
                break;
            case "subject":
                assertIsNonNull(parent)
                assertIsProfile(parent)
                event = { data: addedNode, type: "add", sideEffects: { updatedParent: parent } };
        }
        db.events.add({ event: event, email: email, created_at: new Date().toISOString(), edited_at: new Date().toISOString() })
    }

    static async createDeleteGameEvent() {

    }

    static async createDeleteProfileEvent() {

    }

    static async createDeleteSubjectEvent() {

    }

    static async createIsoUpdateEvent() {

    }

    static async createSortUpdateEvent() {

    }

    static async createLineageUpdateEvent() {

    }
}