import { db } from "../db";
import type { Action, ActionAdd, ActionDelete, ActionUpdate } from "../model/Action";

export default class IndexedDBService {
    constructor() { }

    static async addNode(action: ActionAdd, email: string) {
        const addedNode = action.targets[0]
        await db.nodes.add({ email: email, node_id: addedNode.id, node: addedNode });
    }

    static async deleteNodes(action: ActionDelete, email: string) {
        const ids = action.targets as "node_id"[];
        await db.nodes.bulkDelete(ids);
    }

    static async updateNode(action: ActionUpdate, email: string) {

    }

    static async updateCurrentUser(email: string){
        await db.currentUser.clear();
        db.currentUser.add({email: email});
    }

    static async signOutCurrentUser(){
        await db.currentUser.clear();
    }
}