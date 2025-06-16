import type { HandleAddSubject } from "../../components/addItemCard/AddItemCardProps";
import type { HandleDeathCountOperation } from "../../components/card/Card";
import type { ModalListItemDistinctState } from "../../components/modals/ModalListItemStateTypes";
import type { HistoryStateType, HistoryContextType } from "../../contexts/historyContext";
import type { TreeStateType, TreeContextType } from "../../contexts/treeContext";
import type { URLMapStateType, URLMapContextType } from "../../contexts/urlMapContext";
import HistoryContextManager from "../../features/HistoryContextManager";
import TreeContextManager from "../../features/TreeContextManager";
import URLMapContextManager from "../../features/URLMapContextManager";
import type { ActionAdd, ActionDelete, ActionUpdate } from "../../model/Action";
import type { Subject, DeathType, TangibleTreeNodeParent } from "../../model/TreeNodeModel";
import IndexedDBService from "../../services/IndexedDBService";

export default function profileSubjectsHandlers(tree: TreeStateType,
    setTree: TreeContextType[1],
    history: HistoryStateType,
    setHistory: HistoryContextType[1],
    profileID: string,
) {

    const handleAdd: HandleAddSubject = (
        inputText: string,
        notable: boolean | undefined,
        dateStartR: boolean | undefined,
        dateEndR: boolean | undefined,
        boss: boolean | undefined,
        location: boolean | undefined,
        other: boolean | undefined,
    ) => {
        const node = TreeContextManager.createSubject(inputText, profileID, {
            notable: notable,
            dateStartR: dateStartR,
            dateEndR: dateEndR,
            boss: boss,
            location: location,
            other: other,
        });

        // memory data structures
        const { treeCopy, actions } = TreeContextManager.addNode(tree, node);
        const actionAdd = actions[0] as ActionAdd;
        const actionUpdate = actions[1] as ActionUpdate;
        const updatedHistory = HistoryContextManager.updateActionHistory(history, actions);

        // db's
        try {
            IndexedDBService.addNode(actionAdd.targets[0], localStorage.getItem("email")!);
            IndexedDBService.updateNode(actionUpdate.targets[0], localStorage.getItem("email")!);
        } catch (error) {
            console.error(error);
        }

        setTree(treeCopy);
        setHistory(updatedHistory);
    };

    function handleDelete(node: Subject) {
        const bool = window.confirm();
        if (bool) {
            // memory data structures
            const { treeCopy, actions } = TreeContextManager.deleteNode(
                tree,
                node,
            );
            const actionDelete = actions[0] as ActionDelete;
            const actionUpdate = actions[1] as ActionUpdate;
            const updatedHistory = HistoryContextManager.updateActionHistory(history, actions);

            // db's
            try {
                IndexedDBService.deleteNodes(actionDelete.targets);
                IndexedDBService.updateNode(actionUpdate.targets[0], localStorage.getItem("email")!);
            } catch (error) {
                console.error(error);
            }

            setTree(treeCopy);
            setHistory(updatedHistory);
        }
    }

    function handleDeathCount(
        subject: Subject,
        deathType: DeathType,
        operation: HandleDeathCountOperation,
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
        const { treeCopy, actions } = TreeContextManager.updateNode(
            tree,
            updatedSubject,
        );
        const actionUpdate = actions[0] as ActionUpdate;
        const actionUpdateParent = actions[1] as ActionUpdate;
        const updatedHistory = HistoryContextManager.updateActionHistory(history, actions);

        // db's
        try {
            IndexedDBService.updateNode(actionUpdate.targets[0], localStorage.getItem("email")!);
            IndexedDBService.updateNode(actionUpdateParent.targets[0], localStorage.getItem("email")!);
        } catch (error) {
            console.error(error);
        }

        setTree(treeCopy);
        setHistory(updatedHistory);
    }

    function handleCompletedStatus(subject: Subject, newStatus: boolean) {
        // memory data structures
        const { treeCopy, actions } = TreeContextManager.updateNodeCompletion(
            subject,
            newStatus,
            tree,
        );
        const actionUpdate = actions[0] as ActionUpdate;
        const actionUpdateParent = actions[1] as ActionUpdate;
        const updatedHistory = HistoryContextManager.updateActionHistory(history, actions);

        // db's
        try {
            IndexedDBService.updateNode(actionUpdate.targets[0], localStorage.getItem("email")!);
            IndexedDBService.updateNode(actionUpdateParent.targets[0], localStorage.getItem("email")!);

        } catch (error) {
            console.error(error);
        }

        setTree(treeCopy);
        setHistory(updatedHistory);
    }

    function handleDetailsEdit(subject: Subject, modalState: ModalListItemDistinctState[]) {
        const subjectCopy = { ...subject };
        modalState.forEach((state) => {
            if (state.type == "inputEdit") {
                subjectCopy.name = state.change != "" ? state.change : subjectCopy.name
            }
        })

        // memory data structures
        const { treeCopy, actions } = TreeContextManager.updateNode(tree, subjectCopy!);
        const actionUpdate = actions[0] as ActionUpdate;
        const actionUpdateParent = actions[1] as ActionUpdate;

        // db's
        try {
            IndexedDBService.updateNode(actionUpdate.targets[0], localStorage.getItem("email")!);
            IndexedDBService.updateNode(actionUpdateParent.targets[0], localStorage.getItem("email")!);

        } catch (error) {
            console.error(error);
        }

        setTree(treeCopy);
        setHistory(HistoryContextManager.updateActionHistory(history, actions));
    }

    return { handleAdd, handleDelete, handleCompletedStatus, handleDeathCount, handleDetailsEdit };
}