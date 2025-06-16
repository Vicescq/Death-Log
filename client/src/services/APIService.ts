import type { User } from "firebase/auth";
import type { DistinctTreeNode } from "../model/TreeNodeModel";

export default class APIService {
    constructor() { };

    static async addNodes(email: string, token: string, nodes: DistinctTreeNode[]) {
        fetch(`/api/nodes/${email}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(nodes)
        })
    }

    static deleteNodes() {

    }

    static updateNodes() {

    }

    static addURLS() {

    }

    static deleteURLS() {

    }

    static getNodes() {

    }

    static getURLMappings() {

    }

    static async signInUser(user: User, token: string) {
        fetch("/api/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(user)
        });
    }
}



// static postDeathLog(uuid: string, actions: Action[]) {
//     const serializedActionHistory = JSON.stringify(actions);
//     fetch(`/api/nodes/${uuid}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: serializedActionHistory
//     });
// }

// static getDeathLog(uuid: string, tree: TreeStateType, setTree: TreeContextType[1]) {
//     fetch(`/api/nodes/${uuid}`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//     }).then((res) => res.json()).then((value) => {
//         console.log("FROM DB", value);

//         // run migrations here

//         // const initTree = TreeContextManager.initTree(tree, value);
//         // setTree(initTree);
//     })
// }