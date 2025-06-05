import type { HistoryStateType } from "../contexts/historyContext";
import type { TreeContextType } from "../contexts/treeContext";
import { v4 as uuid4 } from "uuid";
import type { Action } from "../model/Action";
import type { TreeNode } from "../model/TreeNodeModel";
import { convertOldModelToNew } from "../utils/migrations";

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
            // const convertedNodes = convertOldModelToNew(value);
            // console.log("CONVERTED:", convertedNodes);
            dispatchTree({ type: "init", targets: [] });
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