import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Profile from "../classes/Profile";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import useHistoryContext from "../hooks/useHistoryContext";
import Action from "../classes/Action";
import useSaveDeathLogStatus from "../hooks/useSaveDeathLogStatus";
import { useRef } from "react";
import useCurrentHistoryIndex from "../hooks/useCurrentHistoryIndex";

export default function GameProfiles({ gameID }: { gameID: string }) {
    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [history, setHistory] = useHistoryContext();
    const currentHistoryIndexRef = useCurrentHistoryIndex();

    function handleAdd(inputText: string, autoDate: boolean = true) {
        const node = UIHelper.handleAddHelper(inputText, tree, autoDate, "profile", gameID);
        ContextManager.addNode(tree, setTree, node, urlMap, setURLMap);
        ContextManager.updateHistory(history, setHistory, new Action("add", [node]));

    }

    function handleDelete(node: Profile) {
        const deletedNodes = ContextManager.deleteNode(tree, setTree, node, urlMap, setURLMap);
        ContextManager.updateHistory(history, setHistory, new Action("delete", [...deletedNodes!]));
    }
    useSaveDeathLogStatus(history, currentHistoryIndexRef);

    return (
        <>
            GameProfiles
            <AddItemCard itemType="profile" handleAdd={handleAdd} />
            {
                tree.get(gameID)?.childIDS.map((nodeID, index) => {
                    const profile = tree.get(nodeID) as Profile;
                    return <Card key={index} treeNode={profile} handleDelete={() => handleDelete(profile)} />

                })
            }
        </>
    )
}