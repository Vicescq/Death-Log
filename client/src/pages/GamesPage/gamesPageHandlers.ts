import type { HandleAddGame } from "../../components/addItemCard/AddItemCardProps";
import type {
    HistoryContextType,
    HistoryStateType,
} from "../../contexts/historyContext";
import type {
    TreeContextType,
    TreeStateType,
} from "../../contexts/treeContext";
import type { UUIDStateType } from "../../contexts/uuidContext";
import HistoryContextManager from "../../features/HistoryContextManager";
import TreeContextManager from "../../features/TreeContextManager";
import type { ActionAdd, ActionDelete } from "../../model/Action";
import type { Game } from "../../model/TreeNodeModel";
import IndexedDBService from "../../services/IndexedDBService";
import { changeCompletedStatus } from "../../utils/eventHandlers";

export default function gamesPageHandlers(
    tree: TreeStateType,
    setTree: TreeContextType[1],
    history: HistoryStateType,
    setHistory: HistoryContextType[1],
    showBoundary: (error: any) => void,
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
        const { treeCopy, actions } = TreeContextManager.addNode(
            tree,
            node,
        );
        try{
            const actionAdd = actions[0] as ActionAdd;
            IndexedDBService.addNode(actionAdd, await IndexedDBService.getCurrentUser())
            setTree(treeCopy);
            setHistory(
                HistoryContextManager.updateActionHistory(history, actions),
            );
        }
        catch(error){
            console.error(error)
        }
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
