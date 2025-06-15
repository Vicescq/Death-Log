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
import type { ActionAdd, ActionDelete } from "../../model/Action";
import type { Game, TangibleTreeNodeParent } from "../../model/TreeNodeModel";
import IndexedDBService from "../../services/IndexedDBService";
import { changeCompletedStatus } from "../../utils/eventHandlers";

export default function gamesPageHandlers(
    tree: TreeStateType,
    setTree: TreeContextType[1],
    history: HistoryStateType,
    setHistory: HistoryContextType[1],
    urlMap: URLMapStateType,
    setURLMap: URLMapContextType[1]
) {
    const handleAdd: HandleAddGame = async (
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
        const tangibleParentNode = actionAdd.targets[0] as TangibleTreeNodeParent
        const updatedURLMap = URLMapContextManager.addURL(urlMap, tangibleParentNode);
        const updatedHistory = HistoryContextManager.updateActionHistory(history, actions)

        // db's
        try {
            IndexedDBService.addNode(actionAdd.targets[0], localStorage.getItem("email")!);
            IndexedDBService.addURL(tangibleParentNode, localStorage.getItem("email")!);
        }
        catch (error) {
            console.error(error)
        }

        setTree(treeCopy);
        setURLMap(updatedURLMap);
        setHistory(updatedHistory);
    };

    function handleDelete(node: Game) {
        const bool = window.confirm();
        if (bool) {
            const { treeCopy, actions } = TreeContextManager.deleteNode(
                tree,
                node,
            );
            setTree(treeCopy);
            setHistory(
                HistoryContextManager.updateActionHistory(history, actions),
            );

            // if (typeof uuid == "string") {
            //     const deleteAction = actions[0] as ActionDelete
            //     IndexedDBService.deleteNodes(deleteAction, uuid);
            // }
        }
    }

    function handleCompletedStatus(game: Game, newStatus: boolean) {
        const { treeCopy, actions } = changeCompletedStatus(
            game,
            newStatus,
            tree,
        );
        setTree(treeCopy);
        setHistory(HistoryContextManager.updateActionHistory(history, actions));
    }

    return { handleAdd, handleDelete, handleCompletedStatus };
}
