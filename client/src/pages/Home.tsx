import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Game from "../classes/Game";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import { useAuth } from "@clerk/clerk-react";
import usePollNodeStatus from "../hooks/usePollNodeStatus";
import { useRef } from "react";
import type { NodeEntry } from "../classes/APIManager";

export default function Home() {

    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const newNodeEntriesRef = useRef<NodeEntry[]>([]);
    const deletedNodeIDSRef = useRef<string[]>([]);
    const userID = useAuth().userId;

    function handleAdd(inputText: string, autoDate: boolean = true) {
        const node = UIHelper.handleAddHelper(inputText, tree, autoDate, "game");
        newNodeEntriesRef.current.push({userID: userID!, node: node})
        ContextManager.addNode(tree, setTree, node!, urlMap, setURLMap);
    }

    function handleDelete(node: Game) {
        deletedNodeIDSRef.current.push(node.id);
        ContextManager.deleteNode(tree, setTree, node, urlMap, setURLMap);
    }
    usePollNodeStatus(newNodeEntriesRef, deletedNodeIDSRef)
    return (
        <>
            Home
            <AddItemCard itemType="game" handleAdd={handleAdd} />
            {
                tree.get("ROOT_NODE")?.childIDS.map((nodeID, index) => {
                    const game = tree.get(nodeID) as Game;
                    return <Card key={index} treeNode={game} handleDelete={() => handleDelete(game)} />
                })
            }
        </>
    )
}