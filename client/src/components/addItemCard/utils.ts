import type { HistoryStateType, HistoryContextType } from "../../contexts/historyContext";
import HistoryContextManager from "../../contexts/managers/HistoryContextManager";
import TreeContextManager from "../../contexts/managers/TreeContextManager";
import type { TreeStateType, TreeContextType } from "../../contexts/treeContext";
import IndexedDBService from "../../services/IndexedDBService";
import { v4 as uuidv4 } from 'uuid';

export function addItemCardStressTest(pageType: "game" | "profile" | "subject", tree: TreeStateType, setTree: TreeContextType[1], history: HistoryStateType, setHistory: HistoryContextType[1], setAlert: React.Dispatch<React.SetStateAction<string>>, modalRef: React.RefObject<HTMLDialogElement | null>, parentID: string) {
    try {
        const inputText = uuidv4();
        // memory data structures
        const { updatedTree, actions } =
            TreeContextManager.addNode(tree, pageType, inputText, parentID);
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
            setAlert(e.message);
            modalRef.current?.showModal();
        } else {
            // db stuff
        }
    }
}