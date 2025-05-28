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
import useCurrentHistoryIndex from "../hooks/useCurrentHistoryIndex";
import CardWrapper from "../components/CardWrapper";

export default function GameProfiles({ gameID }: { gameID: string }) {
    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [history, setHistory] = useHistoryContext();
    const currentHistoryIndexRef = useCurrentHistoryIndex();

    function handleAdd(inputText: string, autoDate: boolean = true) {
        const node = UIHelper.handleAddHelper(inputText, tree, autoDate, "profile", gameID);
        ContextManager.addNodes(tree, setTree, urlMap, setURLMap, [node]);
        ContextManager.updateHistory(history, setHistory, new Action("add", [node]), new Action("update", [tree.get(gameID!)!]));
    }

    function handleDelete(node: Profile) {
        const bool = window.confirm();
        if (bool) {
            const deletedNodes = ContextManager.deleteNode(tree, setTree, node, urlMap, setURLMap);
            ContextManager.updateHistory(history, setHistory, new Action("delete", [...deletedNodes!]), new Action("update", [tree.get(node.parentID!)!]));
        }
    }

    function handleCompletedStatus(profile: Profile, newStatus: boolean) {
        const bool = window.confirm();
        if (bool) {
            profile.completed = newStatus;
            ContextManager.updateNode(profile, tree, setTree);
            ContextManager.updateHistory(history, setHistory, new Action("update", [profile]));
        }
    }

    function createCards() {
        return tree.get(gameID)?.childIDS.map((nodeID, index) => {
            const profile = tree.get(nodeID) as Profile;
            return <Card 
            key={index} 
            tree={tree} 
            treeNode={profile} 
            handleDelete={() => handleDelete(profile)} 
            handleCompletedStatus={(newStatus) => handleCompletedStatus(profile, newStatus)}
            />
        })
    }

    useSaveDeathLogStatus(history, currentHistoryIndexRef);

    return (
        <>
            <AddItemCard itemType="profile" handleAdd={handleAdd} />
            <CardWrapper cards={createCards()} />
        </>
    )
}