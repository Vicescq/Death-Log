import type { AICSubjectOverrides } from "../../components/addItemCard/types";
import type { CardModalStateGame } from "../../components/card/types";
import type { HistoryContextType, HistoryStateType } from "../../contexts/historyContext";
import HistoryContextManager from "../../contexts/managers/HistoryContextManager";
import TreeContextManager from "../../contexts/managers/TreeContextManager";
import { sanitizeTreeNodeEntry } from "../../contexts/managers/treeUtils";
import type { TreeContextType, TreeStateType } from "../../contexts/treeContext";
import type { DistinctTreeNode, Subject } from "../../model/TreeNodeModel";
import IndexedDBService from "../../services/IndexedDBService";

export function handleAdd(inputText: string, pageType: "game" | "profile" | "subject", tree: TreeStateType, setTree: TreeContextType[1], history: HistoryStateType, setHistory: HistoryContextType[1], setWarning: React.Dispatch<React.SetStateAction<string>>, warningModalRef: React.RefObject<HTMLDialogElement | null>, parentID: string, overrides?: AICSubjectOverrides) {
    try {

        // memory data structures
        const { updatedTree, actions } =
            TreeContextManager.addNode(tree, pageType, inputText, parentID, overrides);
        const updatedHistory = HistoryContextManager.updateActionHistory(
            history,
            [actions.self, actions.parent],
        );

        // db's
        IndexedDBService.addNode(
            actions.self.targets,
            localStorage.getItem("email")!, actions.parent.targets
        );

        setTree(updatedTree);
        setHistory(updatedHistory);
    } catch (e) {
        if (e instanceof Error) {
            setWarning(e.message);
            warningModalRef.current?.showModal();
        } else {
            // db stuff
        }
    }
}

export function handleDelete(node: DistinctTreeNode, tree: TreeStateType, setTree: TreeContextType[1], history: HistoryStateType, setHistory: HistoryContextType[1], parentID: string) {
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
        setTree(updatedTree);
        setHistory(updatedHistory);
    } catch (error) {
        console.error(error);
    }

}

export function handleCardModalSave(
    node: DistinctTreeNode,
    overrides: CardModalStateGame, tree: TreeStateType, setTree: TreeContextType[1], history: HistoryStateType, setHistory: HistoryContextType[1], setWarning: React.Dispatch<React.SetStateAction<string>>, warningModalRef: React.RefObject<HTMLDialogElement | null>, cardModalRef: React.RefObject<HTMLDialogElement | null>, parentID: string
) {
    try {
        sanitizeTreeNodeEntry(overrides.name, tree, parentID);

        // in memory
        const { updatedTree, actions } =
            TreeContextManager.updateNode(tree, node, overrides, parentID);


        const updatedHistory =
            HistoryContextManager.updateActionHistory(history, [
                actions.self,
                actions.parent,
            ]);

        // db's
        IndexedDBService.updateNode(
            actions.self.targets,
            localStorage.getItem("email")!,
        );
        IndexedDBService.updateNode(
            actions.parent.targets,
            localStorage.getItem("email")!,
        );

        setTree(updatedTree);
        setHistory(updatedHistory);

        cardModalRef.current?.close();

    } catch (e) {
        if (e instanceof Error) {
            setWarning(e.message);
            cardModalRef.current?.close();
            warningModalRef.current?.showModal();
        } else {
            throw new Error("DEV ERROR!");
        }
    }
}

export function handleCompletedStatus(node: DistinctTreeNode, tree: TreeStateType, setTree: TreeContextType[1], history: HistoryStateType, setHistory: HistoryContextType[1], parentID: string) {
    const newStatus = !node.completed;
    const dateEnd = newStatus ? new Date().toISOString() : null;

    // memory data structures
    const { updatedTree, actions } =
        TreeContextManager.updateNode(tree, node, {
            dateEnd: dateEnd,
            completed: newStatus,
        }, parentID);

    const updatedHistory = HistoryContextManager.updateActionHistory(history, [actions.self, actions.parent]);

    // db's
    try {
        IndexedDBService.updateNode(
            actions.self.targets,
            localStorage.getItem("email")!,
        );
        IndexedDBService.updateNode(
            actions.parent.targets,
            localStorage.getItem("email")!,
        );
    } catch (error) {
        console.error(error);
    }

    setTree(updatedTree);
    setHistory(updatedHistory);
}

export function handleDeathCount(subject: Subject, operation: "add" | "subtract", tree: TreeStateType, setTree: TreeContextType[1], history: HistoryStateType, setHistory: HistoryContextType[1], parentID: string) {
    const updatedSubject: Subject = { ...subject };
    if (operation == "add") {
        updatedSubject.deaths++

    } else {
        updatedSubject.deaths--
    }

    updatedSubject.deaths < 0 ? (updatedSubject.deaths = 0) : null;

    // in memory
    const { updatedTree, actions } =
        TreeContextManager.updateNode(tree, updatedSubject, {}, parentID);


    const updatedHistory =
        HistoryContextManager.updateActionHistory(history, [
            actions.self,
            actions.parent,
        ]);

    try {
        // db's
        IndexedDBService.updateNode(
            actions.self.targets,
            localStorage.getItem("email")!,
        );
        IndexedDBService.updateNode(
            actions.parent.targets,
            localStorage.getItem("email")!,
        );

        setTree(updatedTree);
        setHistory(updatedHistory);
    }

    catch (e) {
        if (e instanceof Error) {
            console.error(e);
        } else {
            throw new Error("DEV ERROR!");
        }
    }
}