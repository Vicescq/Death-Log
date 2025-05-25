import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Profile from "../classes/Profile";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import { useAuth } from "@clerk/clerk-react";

export default function GameProfiles({ gameID }: { gameID: string }) {
    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const userID = useAuth().userId;

    function handleAdd(inputText: string, autoDate: boolean = true) {
        UIHelper.handleAddHelper(inputText, tree, setTree, urlMap, setURLMap, autoDate, "profile", userID!, gameID);
    }

    function handleDelete(node: Profile) {
        ContextManager.deleteNode(tree, setTree, node, urlMap, setURLMap);
    }

    return (
        <>
            GameProfiles
            <AddItemCard itemType="profile" handleAdd={handleAdd} />
            {
                tree.get(gameID)?.childIDS.map((nodeID, index) => {
                    const profile = tree.get(nodeID) as Profile;
                    return <Card key={index} treeNode={profile} handleDelete={() => handleDelete(profile)}/>
                    
                })
            }
        </>
    )
}