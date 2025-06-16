import type { HandleAddGame } from "../../components/addItemCard/AddItemCardProps";
import type {
    HistoryContextType,
    HistoryStateType,
} from "../../contexts/historyContext";
import type {
    TreeContextType,
    TreeStateType,
} from "../../contexts/treeContext";
import type { URLMapContextType, URLMapStateType } from "../../contexts/urlMapContext";
import type { UUIDStateType } from "../../contexts/uuidContext";
import HistoryContextManager from "../../features/HistoryContextManager";
import TreeContextManager from "../../features/TreeContextManager";
import URLMapContextManager from "../../features/URLMapContextManager";
import type { ActionAdd, ActionDelete, ActionUpdate } from "../../model/Action";
import type { Game, TangibleTreeNodeParent } from "../../model/TreeNodeModel";
import IndexedDBService from "../../services/IndexedDBService";

export default function gamesPageHandlers(
    tree: TreeStateType,
    setTree: TreeContextType[1],
    history: HistoryStateType,
    setHistory: HistoryContextType[1],
    urlMap: URLMapStateType,
    setURLMap: URLMapContextType[1]
) {
    const handleAdd: HandleAddGame = (
        inputText: string,
        dateStartR: boolean | undefined,
        dateEndR: boolean | undefined,
    ) => {

        const node = TreeContextManager.createGame(inputText, tree, {
            dateStartR: dateStartR,
            dateEndR: dateEndR,
        });

        // memory data structures
        const { treeCopy, actions } = TreeContextManager.addNode(
            tree,
            node,
        );
        const actionAdd = actions[0] as ActionAdd;
        const tangibleParentNode = actionAdd.targets[0] as TangibleTreeNodeParent;
        const updatedURLMap = URLMapContextManager.addURL(urlMap, tangibleParentNode);
        const updatedHistory = HistoryContextManager.updateActionHistory(history, actions);

        // db's
        try {
            IndexedDBService.addNode(actionAdd.targets[0], localStorage.getItem("email")!);
            IndexedDBService.addURL(tangibleParentNode, localStorage.getItem("email")!);
        }
        catch (error) {
            console.error(error);
        }

        setTree(treeCopy);
        setURLMap(updatedURLMap);
        setHistory(updatedHistory);
    };

    function handleDelete(node: Game) {
        const bool = window.confirm();
        if (bool) {

            // memory data structures
            const { treeCopy, actions } = TreeContextManager.deleteNode(
                tree,
                node,
            );
            const actionDelete = actions[0] as ActionDelete;
            const updatedURLMap = URLMapContextManager.deleteURL(urlMap, actionDelete.targets);
            const updatedHistory = HistoryContextManager.updateActionHistory(history, actions);

            // db's
            try {
                IndexedDBService.deleteNodes(actionDelete.targets);
                IndexedDBService.deleteURLS(actionDelete.targets);

            } catch (error) {
                console.error(error);
            }

            setTree(treeCopy);
            setURLMap(updatedURLMap);
            setHistory(updatedHistory);
        }
    }

    function handleCompletedStatus(game: Game, newStatus: boolean) {

        // memory data structures
        const { treeCopy, actions } = TreeContextManager.updateNodeCompletion(
            game,
            newStatus,
            tree,
        );
        const updatedHistory = HistoryContextManager.updateActionHistory(history, actions);

        // db's
        try {
            const actionUpdate = actions[0] as ActionUpdate;
            IndexedDBService.updateNode(actionUpdate.targets[0], localStorage.getItem("email")!);

        } catch (error) {
            console.error(error);
        }

        setTree(treeCopy);
        setHistory(updatedHistory);
    }

    return { handleAdd, handleDelete, handleCompletedStatus };
}
