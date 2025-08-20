import { useEffect } from "react";
import type { HistoryContextType, HistoryStateType } from "../contexts/historyContext";
import APIService from "../services/APIService";
import HistoryContextManager from "../contexts/managers/HistoryContextManager";
import type { UserStateType } from "../contexts/userContext";
import type { URLMapping } from "../db";
import type { TangibleTreeNodeParent } from "../model/TreeNodeModel";

export default function useSyncDeathLog(user: UserStateType, history: HistoryStateType, setHistory: HistoryContextType[1]) {

    useEffect(() => {
        const interval = setTimeout(() => {
            if (history.actionHistory.slice(history.newActionStartIndex).length > 0 && user) {
                (async () => {
                    const token = await user.getIdToken();
                    const batchedHistory = HistoryContextManager.batchHistory(history);
                    const { addedNodes, deletedNodes, updatedNodes } = HistoryContextManager.filterAffectedNodes(batchedHistory);
                    console.log({ addedNodes, deletedNodes, updatedNodes })
                    if (user.email){
                        // APIService.addNodes(user.email, token, addedNodes);
                        // APIService.deleteNodes(user.email, token, deletedNodes);

                        // const mappings: URLMapping["mapping"][] = [];
                        // for (let i = 0; i < addedNodes.length; i++){
                        //     const tangibleParentNode = addedNodes[i] as TangibleTreeNodeParent;
                        //     if (tangibleParentNode?.path){
                        //         mappings.push({path: tangibleParentNode.path, node_id: tangibleParentNode.id});
                        //     }
                        // }
                        // APIService.addURLS(user.email, token, mappings)
                    }
                })();
                setHistory(HistoryContextManager.updateNewActionStartIndex(history));
            }
        }, 3000);
        return () => clearTimeout(interval);
    }, [history]);
}