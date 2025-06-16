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
import HistoryContextManager from "../../features/HistoryContextManager";
import TreeContextManager from "../../features/TreeContextManager";
import URLMapContextManager from "../../features/URLMapContextManager";
import type { Game, TangibleTreeNodeParent } from "../../model/TreeNodeModel";
import IndexedDBService from "../../services/IndexedDBService";

export default function gamesHandlers(
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
        const { updatedTree: updatedTreeIP, action } = TreeContextManager.addNode(
            tree,
            node,
        );
        const { updatedTree } = TreeContextManager.updateNodeParent(node, updatedTreeIP, "add");
        const tangibleParentNode = action.targets as TangibleTreeNodeParent;
        const updatedURLMap = URLMapContextManager.addURL(urlMap, tangibleParentNode);
        const updatedHistory = HistoryContextManager.updateActionHistory(history, [action]);

        // db's
        try {
            IndexedDBService.addNode(action.targets, localStorage.getItem("email")!);
            IndexedDBService.addURL(tangibleParentNode, localStorage.getItem("email")!);
        }
        catch (error) {
            console.error(error);
        }

        setTree(updatedTree);
        setURLMap(updatedURLMap);
        setHistory(updatedHistory);
    };

    function handleDelete(node: Game) {
        const bool = window.confirm();
        if (bool) {

            // memory data structures
            const { updatedTree: updatedTreeIP, action } = TreeContextManager.deleteNode(
                tree,
                node,
            );
            const { updatedTree } = TreeContextManager.updateNodeParent(node, updatedTreeIP, "delete");
            const updatedURLMap = URLMapContextManager.deleteURL(urlMap, action.targets);
            const updatedHistory = HistoryContextManager.updateActionHistory(history, [action]);

            // db's
            try {
                IndexedDBService.deleteNode(action.targets);
                IndexedDBService.deleteURLS(action.targets);

            } catch (error) {
                console.error(error);
            }

            setTree(updatedTree);
            setURLMap(updatedURLMap);
            setHistory(updatedHistory);
        }
    }

    function handleCompletedStatus(game: Game, newStatus: boolean) {

        // memory data structures
        const { updatedTree: updatedTreeIP, action } = TreeContextManager.updateNodeCompletion(
            game,
            newStatus,
            tree,
        );
        const { updatedTree } = TreeContextManager.updateNodeParent(game, updatedTreeIP, "update");
        const updatedHistory = HistoryContextManager.updateActionHistory(history, [action]);

        // db's
        try {
            IndexedDBService.updateNode(action.targets, localStorage.getItem("email")!);

        } catch (error) {
            console.error(error);
        }

        setTree(updatedTree);
        setHistory(updatedHistory);
    }

    return { handleAdd, handleDelete, handleCompletedStatus };
}
