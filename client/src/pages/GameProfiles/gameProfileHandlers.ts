import type { HandleAddProfile } from "../../components/addItemCard/AddItemCardProps";
import type { HistoryStateType, HistoryContextType } from "../../contexts/historyContext";
import type { TreeStateType, TreeContextType } from "../../contexts/treeContext";
import type { URLMapContextType, URLMapStateType } from "../../contexts/urlMapContext";
import HistoryContextManager from "../../features/HistoryContextManager";
import TreeContextManager from "../../features/TreeContextManager";
import URLMapContextManager from "../../features/URLMapContextManager";
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
        const { updatedTree: updatedTreeIP, action: actionAdd } = TreeContextManager.addNode(
            tree,
            node,
        );
        const { updatedTree, action: actionUpdate } = TreeContextManager.updateNodeParent(node, updatedTreeIP, "add");
        const tangibleParentNode = actionAdd.targets as TangibleTreeNodeParent;
        const updatedURLMap = URLMapContextManager.addURL(urlMap, tangibleParentNode);
        const updatedHistory = HistoryContextManager.updateActionHistory(history, [actionAdd, actionUpdate]);

        // db's
        try {
            IndexedDBService.addNode(actionAdd.targets, localStorage.getItem("email")!);
            IndexedDBService.updateNode(actionUpdate.targets, localStorage.getItem("email")!);
            IndexedDBService.addURL(tangibleParentNode, localStorage.getItem("email")!);
        } catch (error) {
            console.error(error);
        }

        setTree(updatedTree);
        setURLMap(updatedURLMap)
        setHistory(updatedHistory);
    };

    function handleDelete(node: Profile) {
        const bool = window.confirm();
        if (bool) {

            // memory data structures
            const { updatedTree: updatedTreeIP, action: actionDelete } = TreeContextManager.deleteNode(
                tree,
                node,
            );
            const { updatedTree, action: actionUpdate } = TreeContextManager.updateNodeParent(node, updatedTreeIP, "delete");
            const updatedURLMap = URLMapContextManager.deleteURL(urlMap, actionDelete.targets);
            const updatedHistory = HistoryContextManager.updateActionHistory(history, [actionDelete, actionUpdate]);

            // db's
            try {
                IndexedDBService.deleteNodes(actionDelete.targets);
                IndexedDBService.updateNode(actionUpdate.targets, localStorage.getItem("email")!);
                IndexedDBService.deleteURLS(actionDelete.targets);
            } catch (error) {
                console.error(error);
            }

            setTree(updatedTree);
            setURLMap(updatedURLMap)
            setHistory(updatedHistory);
        }
    }

    function handleCompletedStatus(profile: Profile, newStatus: boolean) {

        // memory data structures
        const { updatedTree: updatedTreeIP, action: actionUpdateSelf } = TreeContextManager.updateNodeCompletion(
            profile,
            newStatus,
            tree,
        );
        const { updatedTree, action: actionUpdateParent } = TreeContextManager.updateNodeParent(profile, updatedTreeIP, "update");
        const updatedHistory = HistoryContextManager.updateActionHistory(history, [actionUpdateSelf, actionUpdateParent]);

        // db's
        try {
            IndexedDBService.updateNode(actionUpdateSelf.targets, localStorage.getItem("email")!);
            IndexedDBService.updateNode(actionUpdateParent.targets, localStorage.getItem("email")!);

        } catch (error) {
            console.error(error);
        }

        setTree(updatedTree);
        setHistory(updatedHistory);
    }

    return { handleAdd, handleDelete, handleCompletedStatus };
}