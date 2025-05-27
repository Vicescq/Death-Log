import type { HistoryStateType } from "../contexts/historyContext";
import Action from "./Action";
import Game from "./Game";
import Profile from "./Profile";
import Subject from "./Subject";

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

    static loadNodes(uuid: string) {
        fetch(`/api/load_nodes/${uuid}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
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