import type { HandleAddGame } from "../../components/addItemCard/AddItemCardProps";
import type {
    HistoryContextType,
    HistoryStateType,
} from "../../contexts/historyContext";
import type {
    TreeContextType,
    TreeStateType,
} from "../../contexts/treeContext";
import HistoryContextManager from "../../features/HistoryContextManager";
import TreeContextManager from "../../features/TreeContextManager";
import type { Game } from "../../model/TreeNodeModel";
import { changeCompletedStatus } from "../../utils/eventHandlers";

export default function homePageHandlers(
    tree: TreeStateType,
    setTree: TreeContextType[1],
    history: HistoryStateType,
    setHistory: HistoryContextType[1],
    showBoundary: (error: any) => void,
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
        const { treeCopy, actions } = TreeContextManager.addNode(
            tree,
            node,
        );
        setTree(treeCopy);
        setHistory(
            HistoryContextManager.updateActionHistory(history, actions),
        );
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
