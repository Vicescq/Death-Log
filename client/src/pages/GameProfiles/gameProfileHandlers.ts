import type { HandleAddProfile } from "../../components/addItemCard/AddItemCardProps";
import type { HistoryStateType, HistoryContextType } from "../../contexts/historyContext";
import type { TreeStateType, TreeContextType } from "../../contexts/treeContext";
import HistoryContextManager from "../../features/HistoryContextManager";
import TreeContextManager from "../../features/TreeContextManager";
import type { Profile } from "../../model/TreeNodeModel";
import { changeCompletedStatus } from "../../utils/eventHandlers";

export default function gameProfileHandlers(tree: TreeStateType,
    setTree: TreeContextType[1],
    history: HistoryStateType,
    setHistory: HistoryContextType[1], gameID: string) {
    const handleAdd: HandleAddProfile = (
        inputText: string,
        dateStartR: boolean | undefined,
        dateEndR: boolean | undefined,
    ) => {
        const node = TreeContextManager.createProfile(inputText, tree, gameID, {
            dateStartR: dateStartR,
            dateEndR: dateEndR,
        });
        const { treeCopy, actions } = TreeContextManager.addNode(tree, node);
        setTree(treeCopy);
        setHistory(HistoryContextManager.updateActionHistory(history, actions));
    };

    function handleDelete(node: Profile) {
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

    function handleCompletedStatus(profile: Profile, newStatus: boolean) {
        const { treeCopy, actions } = changeCompletedStatus(
            profile,
            newStatus,
            tree,
        );
        setTree(treeCopy);
        setHistory(HistoryContextManager.updateActionHistory(history, actions));
    }
    return { handleAdd, handleDelete, handleCompletedStatus };
}