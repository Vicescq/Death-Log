import type { HistoryStateType } from "../contexts/historyContext";
import Action from "./Action";
import ContextManager from "./ContextManager";
import Game from "./Game";
import Profile from "./Profile";
import Subject from "./Subject";
import type { TreeContextType } from "../contexts/treeContext";
import type { URLMapContextType } from "../contexts/urlMapContext";

export default class APIManager {
    constructor() { };

    static storeModifiedNode(historyState: HistoryStateType) {
        const serializedHistory = JSON.stringify(historyState);
        fetch("/api/nodes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: serializedHistory
        })
    }

    static loadNodes(uuid: string, setTree: TreeContextType[1], setURLMap: URLMapContextType[1]) {
        fetch(`/api/load_nodes/${uuid}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json()).then((value) => {
            console.log(value);
            ContextManager.initializeTreeState(value, setTree, setURLMap)
        });
    }

    static deduplicateHistory(history: HistoryStateType, currentHistoryIndexRef: React.RefObject<number>) {

        function reviver(key: any, value: any) {
            if (key == "actionHistory") {
                return value.map((value: any) => Object.assign(Object.create(Action.prototype), value));
            }
            if (key == "_targets") {

                return value.map((value: any) => {
                    switch (value._type) {
                        case "game":
                            return Object.assign(Object.create(Game.prototype), value);
                        case "profile":
                            return Object.assign(Object.create(Profile.prototype), value);
                        case "subject":
                            return Object.assign(Object.create(Subject.prototype), value);
                        default:
                            return value;
                    }
                })
            }
            else {
                return value
            }
        }

        let deduplicatedHistory = structuredClone(history);
        deduplicatedHistory.actionHistory = history.actionHistory.slice(currentHistoryIndexRef.current);
        deduplicatedHistory = JSON.parse(JSON.stringify(deduplicatedHistory), (key, value) => reviver(key, value))

        const nodeIDToActionMap = new Map() as Map<string, Action>;
        deduplicatedHistory.actionHistory.reverse();
        deduplicatedHistory.actionHistory.forEach((action, actionIndex) => {
            action.targets.forEach((node) => {
                if (action.type == "update") {
                    if (!nodeIDToActionMap.has(node.id)) {
                        nodeIDToActionMap.set(node.id, action);
                    }

                    else {

                        deduplicatedHistory.actionHistory[actionIndex] = new Action("__PLACEHOLDER__", []);
                    }
                }
            })
        })

        deduplicatedHistory.actionHistory = deduplicatedHistory.actionHistory.filter((action) => !(action.type == "__PLACEHOLDER__"));
        deduplicatedHistory.actionHistory.reverse()

        return deduplicatedHistory;
    }
}