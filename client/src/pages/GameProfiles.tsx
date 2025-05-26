import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Profile from "../classes/Profile";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import { useAuth } from "@clerk/clerk-react";
import type { NodeEntry } from "../classes/APIManager";
import { useRef } from "react";
import usePollNodeStatus from "../hooks/usePollNodeStatus";

export default function GameProfiles({ gameID }: { gameID: string }) {
    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const newNodeEntriesRef = useRef<NodeEntry[]>([]);
    const deletedNodeIDSRef = useRef<string[]>([]);
    const userID = useAuth().userId;

    function handleAdd(inputText: string, autoDate: boolean = true) {
        const node = UIHelper.handleAddHelper(inputText, tree, autoDate, "profile", gameID);
        newNodeEntriesRef.current.push({userID: userID!, node: node})
        ContextManager.addNode(tree, setTree, node, urlMap, setURLMap);
    }

    function handleDelete(node: Profile) {
        ContextManager.deleteNode(tree, setTree, node, urlMap, setURLMap);
        deletedNodeIDSRef.current.push(node.id);
    }

    usePollNodeStatus(newNodeEntriesRef, deletedNodeIDSRef);

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