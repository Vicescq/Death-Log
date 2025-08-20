import type { HandleAddSubject } from "../../components/addItemCard/AddItemCardTypes";
import type { DeathCountOperation } from "../../model/TreeNodeModel";
import type { ModalListItemDistinctState } from "../../components/modals/ModalListItemStateTypes";
import type { HistoryStateType, HistoryContextType } from "../../contexts/historyContext";
import type { TreeStateType, TreeContextType } from "../../contexts/treeContext";
import HistoryContextManager from "../../contexts/managers/HistoryContextManager";
import TreeContextManager from "../../contexts/managers/TreeContextManager";
import type { Subject, DeathType } from "../../model/TreeNodeModel";
import IndexedDBService from "../../services/IndexedDBService";

export default function subjectsHandlers(tree: TreeStateType,
    setTree: TreeContextType[1],
    history: HistoryStateType,
    setHistory: HistoryContextType[1],
    profileID: string,
) {

    const handleAdd: HandleAddSubject = (
        inputText,
        dateStartR,
        dateEndR,
        boss,
        location,
        other,
        composite,
        reoccurring,
    ) => {
        const node = TreeContextManager.createSubject(inputText, profileID, {
            dateStartR: dateStartR,
            dateEndR: dateEndR,
            boss: boss,
            location: location,
            other: other,
            composite: composite,
            reoccurring: reoccurring,
        });

        // memory data structures
        const { updatedTree: updatedTreeIP, action: actionAdd } = TreeContextManager.addNode(
            tree,
            node,
        );
        const { updatedTree, action: actionUpdate } = TreeContextManager.updateNodeParent(node, updatedTreeIP, "add");
        const updatedHistory = HistoryContextManager.updateActionHistory(history, [actionAdd, actionUpdate]);

        // db's
        try {
            IndexedDBService.addNode(actionAdd.targets, localStorage.getItem("email")!);
            IndexedDBService.updateNode(actionUpdate.targets, localStorage.getItem("email")!);
        } catch (error) {
            console.error(error);
        }

        setTree(updatedTree);
        setHistory(updatedHistory);
    };

    function handleDelete(node: Subject) {
        const bool = window.confirm();
        if (bool) {
            // memory data structures
            const { updatedTree: updatedTreeIP, action: actionDelete } = TreeContextManager.deleteNode(
                tree,
                node,
            );
            const { updatedTree, action: actionUpdate } = TreeContextManager.updateNodeParent(node, updatedTreeIP, "delete");
            const updatedHistory = HistoryContextManager.updateActionHistory(history, [actionDelete, actionUpdate]);

            // db's
            try {
                IndexedDBService.deleteNode(actionDelete.targets);
                IndexedDBService.updateNode(actionUpdate.targets, localStorage.getItem("email")!);
            } catch (error) {
                console.error(error);
            }

            setTree(updatedTree);
            setHistory(updatedHistory);
        }
    }

    function handleDeathCount(
        subject: Subject,
        deathType: DeathType,
        operation: DeathCountOperation,
    ) {
        let updatedSubject: Subject = { ...subject };
        if (operation == "add") {
            deathType == "fullTries"
                ? updatedSubject.fullTries++
                : updatedSubject.resets++;
        } else {
            deathType == "fullTries"
                ? updatedSubject.fullTries--
                : updatedSubject.resets--;
        }
        updatedSubject.fullTries < 0 ? (updatedSubject.fullTries = 0) : null;
        updatedSubject.resets < 0 ? (updatedSubject.resets = 0) : null;

        // memory data structures
        const { updatedTree: updatedTreeIP, action: actionUpdateSelf } = TreeContextManager.updateNode(
            tree,
            updatedSubject,
        );
        const { updatedTree, action: actionUpdateParent } = TreeContextManager.updateNodeParent(updatedSubject, updatedTreeIP, "update");
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

    function handleCompletedStatus(subject: Subject, newStatus: boolean) {
        // memory data structures
        const { updatedTree: updatedTreeIP, action: actionUpdateSelf } = TreeContextManager.updateNodeCompletion(
            subject,
            newStatus,
            tree,
        );
        const { updatedTree, action: actionUpdateParent } = TreeContextManager.updateNodeParent(subject, updatedTreeIP, "update");
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

    function handleDetailsEdit(subject: Subject, modalState: ModalListItemDistinctState[]) {
        const updatedSubject = { ...subject };
        modalState.forEach((state) => {
            if (state.type == "inputEdit") {
                updatedSubject.name = state.change != "" ? state.change : updatedSubject.name;
            }
        })

        // memory data structures
        const { updatedTree: updatedTreeIP, action: actionUpdateSelf } = TreeContextManager.updateNode(
            tree,
            updatedSubject,
        );
        const { updatedTree, action: actionUpdateParent } = TreeContextManager.updateNodeParent(subject, updatedTreeIP, "update");
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

    return { handleAdd, handleDelete, handleCompletedStatus, handleDeathCount, handleDetailsEdit };
}