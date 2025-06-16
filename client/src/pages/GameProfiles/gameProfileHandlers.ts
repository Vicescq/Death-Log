import type { HandleAddProfile } from "../../components/addItemCard/AddItemCardProps";
import type { HistoryStateType, HistoryContextType } from "../../contexts/historyContext";
import type { TreeStateType, TreeContextType } from "../../contexts/treeContext";
import type { URLMapContextType, URLMapStateType } from "../../contexts/urlMapContext";
import HistoryContextManager from "../../features/HistoryContextManager";
import TreeContextManager from "../../features/TreeContextManager";
import URLMapContextManager from "../../features/URLMapContextManager";
import type { ActionAdd, ActionDelete, ActionUpdate } from "../../model/Action";
import type { Profile, TangibleTreeNodeParent } from "../../model/TreeNodeModel";
import IndexedDBService from "../../services/IndexedDBService";

export default function gameProfileHandlers(
    tree: TreeStateType,
    setTree: TreeContextType[1],
    history: HistoryStateType,
    setHistory: HistoryContextType[1],
    gameID: string,
    urlMap: URLMapStateType,
    setURLMap: URLMapContextType[1]
) {

    const handleAdd: HandleAddProfile = (
        inputText: string,
        dateStartR: boolean | undefined,
        dateEndR: boolean | undefined,
    ) => {

        const node = TreeContextManager.createProfile(inputText, tree, gameID, {
            dateStartR: dateStartR,
            dateEndR: dateEndR,
        });

        // memory data structures
        const { treeCopy, actions } = TreeContextManager.addNode(tree, node);
        const actionAdd = actions[0] as ActionAdd;
        const actionUpdate = actions[1] as ActionUpdate;
        const tangibleParentNode = actionAdd.targets[0] as TangibleTreeNodeParent;
        const updatedURLMap = URLMapContextManager.addURL(urlMap, tangibleParentNode);
        const updatedHistory = HistoryContextManager.updateActionHistory(history, actions);

        // db's
        try {
            IndexedDBService.addNode(actionAdd.targets[0], localStorage.getItem("email")!);
            IndexedDBService.updateNode(actionUpdate.targets[0], localStorage.getItem("email")!);
            IndexedDBService.addURL(tangibleParentNode, localStorage.getItem("email")!);
        } catch (error) {
            console.error(error);
        }

        setTree(treeCopy);
        setURLMap(updatedURLMap)
        setHistory(updatedHistory);
    };

    function handleDelete(node: Profile) {
        const bool = window.confirm();
        if (bool) {

            // memory data structures
            const { treeCopy, actions } = TreeContextManager.deleteNode(
                tree,
                node,
            );
            const actionDelete = actions[0] as ActionDelete;
            const actionUpdate = actions[1] as ActionUpdate;
            const updatedURLMap = URLMapContextManager.deleteURL(urlMap, actionDelete.targets);
            const updatedHistory = HistoryContextManager.updateActionHistory(history, actions);

            // db's
            try {
                IndexedDBService.deleteNodes(actionDelete.targets);
                IndexedDBService.updateNode(actionUpdate.targets[0], localStorage.getItem("email")!);
                IndexedDBService.deleteURLS(actionDelete.targets);
            } catch (error) {
                console.error(error);
            }

            setTree(treeCopy);
            setURLMap(updatedURLMap)
            setHistory(updatedHistory);
        }
    }

    function handleCompletedStatus(profile: Profile, newStatus: boolean) {

        // memory data structures
        const { treeCopy, actions } = TreeContextManager.updateNodeCompletion(
            profile,
            newStatus,
            tree,
        );
        const actionUpdate = actions[0] as ActionUpdate;
        const actionUpdateParent = actions[1] as ActionUpdate;
        const updatedHistory = HistoryContextManager.updateActionHistory(history, actions);

        // db's
        try {
            IndexedDBService.updateNode(actionUpdate.targets[0], localStorage.getItem("email")!);
            IndexedDBService.updateNode(actionUpdateParent.targets[0], localStorage.getItem("email")!);

        } catch (error) {
            console.error(error);
        }

        setTree(treeCopy);
        setHistory(updatedHistory);
    }
    
    return { handleAdd, handleDelete, handleCompletedStatus };
}