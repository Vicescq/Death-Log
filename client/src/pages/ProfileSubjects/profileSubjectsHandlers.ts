import type { HandleAddSubject } from "../../components/addItemCard/AddItemCardProps";
import type { HandleDeathCountOperation } from "../../components/Card";
import type { ModalListItemDistinctState } from "../../components/modals/ModalListItemStateTypes";
import type { HistoryStateType, HistoryContextType } from "../../contexts/historyContext";
import type { TreeStateType, TreeContextType } from "../../contexts/treeContext";
import HistoryContextManager from "../../features/HistoryContextManager";
import TreeContextManager from "../../features/TreeContextManager";
import type { Subject, DeathType } from "../../model/TreeNodeModel";
import { changeCompletedStatus } from "../../utils/eventHandlers";

export default function profileSubjectsHandlers(tree: TreeStateType,
    setTree: TreeContextType[1],
    history: HistoryStateType,
    setHistory: HistoryContextType[1], profileID: string) {
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
        const { treeCopy, actions } = TreeContextManager.addNode(tree, node);
        setTree(treeCopy);
        setHistory(HistoryContextManager.updateActionHistory(history, actions));
    };

    function handleDelete(node: Subject) {
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
        const { treeCopy, actions } = TreeContextManager.updateNode(
            tree,
            updatedSubject,
        );
        setTree(treeCopy);
        setHistory(HistoryContextManager.updateActionHistory(history, actions));
    }

    function handleCompletedStatus(subject: Subject, newStatus: boolean) {
        const { treeCopy, actions } = changeCompletedStatus(
            subject,
            newStatus,
            tree,
        );
        setTree(treeCopy);
        setHistory(HistoryContextManager.updateActionHistory(history, actions));
    }

    function handleDetailsEdit(subject: Subject, modalState: ModalListItemDistinctState[]) {
        const subjectCopy = { ...subject };
        modalState.forEach((state) => {
            if (state.type == "inputEdit") {
                subjectCopy.name = state.change != "" ? state.change : subjectCopy.name
            }
        })
        const { treeCopy, actions } = TreeContextManager.updateNode(tree, subjectCopy!);
        setTree(treeCopy);
        setHistory(HistoryContextManager.updateActionHistory(history, actions));
    }

    return { handleAdd, handleDelete, handleCompletedStatus, handleDeathCount, handleDetailsEdit };
}