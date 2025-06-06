import type { TreeContextType, TreeStateType } from "../contexts/treeContext";
import type { Action } from "../model/Action";
import TreeContextManager from "../features/TreeContextManager";

export default class APIService {
    constructor() { };

    static postDeathLog(uuid: string, actions: Action[]) {
        const serializedActionHistory = JSON.stringify(actions);
        fetch(`/api/nodes/${uuid}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: serializedActionHistory
        });
    }

    static getDeathLog(uuid: string, tree: TreeStateType, setTree: TreeContextType[1]) {
        fetch(`/api/nodes/${uuid}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json()).then((value) => {
            console.log("FROM DB", value);

            // run migrations here

            const initTree = TreeContextManager.initTree(tree, value);
            setTree(initTree);
        })
    }

    
}