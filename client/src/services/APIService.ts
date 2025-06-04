import Action from "../model/Action";
import type { HistoryStateType } from "../contexts/historyContext";
import type { TreeContextType } from "../contexts/treeContext";
import { reviveTree } from "../utils/tree";
import type TreeNode from "../model/TreeNode";
import { v4 as uuid4 } from "uuid";

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

    static getDeathLog(uuid: string, dispatchTree: TreeContextType[1]) {
        fetch(`/api/nodes/${uuid}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json()).then((value) => {
            console.log(value);
            const revivedNodes = reviveTree(value);
            dispatchTree({ type: "init", payload: revivedNodes });
        })
    }

    static batchHistory(history: HistoryStateType) {
        const batchedActionHistory = history.actionHistory.slice(history.newActionStartIndex);
        const deduplicatedUpdateActions = new Map<(string | string[]), Action>();
        const finalizedBatchedActionHistory: Action[] = [];
        batchedActionHistory.reverse();
        batchedActionHistory.forEach((action) => {
            if (action.type == "update") {
                const node = action.targets[0] as TreeNode;
                !deduplicatedUpdateActions.has(node.id) ? deduplicatedUpdateActions.set(node.id, action) : null;
            }
            else {
                deduplicatedUpdateActions.set("__PLACEHOLDER__" + uuid4(), action);
            }
        })

        Array.from(deduplicatedUpdateActions.entries()).reverse().forEach((([_, action]) => {
            finalizedBatchedActionHistory.push(action);
        }))

        return finalizedBatchedActionHistory;
    }
}