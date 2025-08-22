import type { CardModalStateGame } from "../../components/card/CardTypes";
import type { HistoryContextType, HistoryStateType } from "../../contexts/historyContext";
import HistoryContextManager from "../../contexts/managers/HistoryContextManager";
import TreeContextManager from "../../contexts/managers/TreeContextManager";
import { sanitizeTreeNodeEntry } from "../../contexts/managers/treeUtils";
import type { TreeContextType, TreeStateType } from "../../contexts/treeContext";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import IndexedDBService from "../../services/IndexedDBService";

export function handleAdd(inputText: string, pageType: "game" | "profile" | "subject", tree: TreeStateType, setTree: TreeContextType[1], history: HistoryStateType, setHistory: HistoryContextType[1], setAlert: React.Dispatch<React.SetStateAction<string>>, modalRef: React.RefObject<HTMLDialogElement | null>, parentID: string) {
    try {

        // memory data structures
        const { updatedTree, actions } =
            TreeContextManager.addNode(tree, pageType, inputText, parentID);
        const updatedHistory = HistoryContextManager.updateActionHistory(
            history,
            [actions.self, actions.parent],
        );
        const node = actions.self.targets;

        // db's
        IndexedDBService.addNode(
            node,
            localStorage.getItem("email")!, tree.get(parentID)!
        );

        setTree(updatedTree);
        setHistory(updatedHistory);
    } catch (e) {
        if (e instanceof Error) {
            setAlert(e.message);
            modalRef.current?.showModal();
        } else {
            // db stuff
        }
    }
}

export function handleDelete(node: DistinctTreeNode, tree: TreeStateType, setTree: TreeContextType[1], history: HistoryStateType, setHistory: HistoryContextType[1], parentID: string) {
    const bool = window.confirm();
    if (bool) {
        // memory data structures
        const { updatedTree, actions } =
            TreeContextManager.deleteNode(tree, node, parentID);
        const updatedHistory = HistoryContextManager.updateActionHistory(
            history,
            [actions.self, actions.parent],
        );

        // db's
        try {
            IndexedDBService.deleteNode(actions.self.targets, node, localStorage.getItem("email")!, actions.parent.targets);
        } catch (error) {
            console.error(error);
        }

        setTree(updatedTree);
        setHistory(updatedHistory);
    }
}

export function handleModalSave(
    node: DistinctTreeNode,
    overrides: CardModalStateGame, tree: TreeStateType, setTree: TreeContextType[1], history: HistoryStateType, setHistory: HistoryContextType[1], setAlert: React.Dispatch<React.SetStateAction<string>>, modalRef: React.RefObject<HTMLDialogElement | null>, parentID: string
) {
    try {
        sanitizeTreeNodeEntry(overrides.name, tree, parentID);

        // in memory
        const { updatedTree: updatedTreeIP, action: actionUpdateSelf } =
            TreeContextManager.updateNode(tree, node, overrides, false);

        const { updatedTree: updatedTree, action: actionUpdateParent } =
            TreeContextManager.updateNode(
                updatedTreeIP,
                tree.get(parentID)!,
                {},
                node,
                "update",
            );
        const updatedHistory =
            HistoryContextManager.updateActionHistory(history, [
                actionUpdateSelf,
                actionUpdateParent,
            ]);

        // db's
        IndexedDBService.updateNode(
            actionUpdateSelf.targets,
            localStorage.getItem("email")!,
        );

        setTree(updatedTree);
        setHistory(updatedHistory);

    } catch (e) {
        if (e instanceof Error) {
            setAlert(e.message);
            modalRef.current?.showModal();
        } else {
            throw new Error("DEV ERROR!");
        }
    }
}


export function handleCompletedStatus(node: DistinctTreeNode, newStatus: boolean, tree: TreeStateType, setTree: TreeContextType[1], history: HistoryStateType, setHistory: HistoryContextType[1], parentID: string) {
    const dateEnd = newStatus ? new Date().toISOString() : null;

    // memory data structures
    const { updatedTree: updatedTreeIP, action: actionUpdateSelf } =
        TreeContextManager.updateNode(tree, node, {
            dateEnd: dateEnd,
            completed: newStatus,
        });
    const { updatedTree: updatedTree, action: actionUpdateParent } =
        TreeContextManager.updateNode(
            updatedTreeIP,
            tree.get(parentID)!,
            {},
            node,
            "update",
        );
    const updatedHistory = HistoryContextManager.updateActionHistory(
        history,
        [actionUpdateSelf, actionUpdateParent],
    );

    // db's
    try {
        IndexedDBService.updateNode(
            actionUpdateSelf.targets,
            localStorage.getItem("email")!,
        );
    } catch (error) {
        console.error(error);
    }

    setTree(updatedTree);
    setHistory(updatedHistory);
}