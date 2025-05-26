import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Game from "../classes/Game";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import usePollNodeStatus from "../hooks/usePollNodeStatus";
import useHistoryContext from "../hooks/useHistoryContext";
import { useEffect, useState } from "react";
import Action from "../classes/Action";


export default function Home() {
    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [history, setHistory] = useHistoryContext();

    function handleAdd(inputText: string, autoDate: boolean = true) {
        const node = UIHelper.handleAddHelper(inputText, tree, autoDate, "game");
        ContextManager.addNode(tree, setTree, node, urlMap, setURLMap);
        ContextManager.updateHistory(history, setHistory, new Action("add", [node]));
    }

    function handleDelete(node: Game) {
        const deletedNodes = ContextManager.deleteNode(tree, setTree, node, urlMap, setURLMap);
        ContextManager.updateHistory(history, setHistory, new Action("delete", [...deletedNodes!]));
    }


    usePollNodeStatus(history);
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