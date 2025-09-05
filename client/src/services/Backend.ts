import type { AddEvent, DeleteEvent } from "../model/EventModel";
import type { DistinctTreeNode } from "../model/TreeNodeModel";

export default class Backend {
    constructor() { };

    static async addEvent(token: string, addEvent: AddEvent) {

        fetch(`http://localhost:3000/nodes`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(addEvent)
        })

    }

    static deleteNodes(token: string, deleteEvent: DeleteEvent) {
        fetch(`http://localhost:3000/nodes`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(deleteEvent)
        })

    }











    static async registerUser(token: string) {
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Authorization": "Bearer " + token },
        });
    }

    static async getNodes(token: string) {
        const response = await fetch("http://localhost:3000/nodes", {
            method: "GET",
            headers: { "Authorization": "Bearer " + token },
        })
        const nodes = await response.json() as DistinctTreeNode[];
        return nodes;

    }
}