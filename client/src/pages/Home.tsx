import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Game from "../classes/Game";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import useSaveDeathLogStatus from "../hooks/useSaveDeathLogStatus";
import useHistoryContext from "../hooks/useHistoryContext";
import Action from "../classes/Action";
import useCurrentHistoryIndex from "../hooks/useCurrentHistoryIndex";
import Modal from "../components/Modal";


export default function Home() {
    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [history, setHistory] = useHistoryContext();

    const currentHistoryIndexRef = useCurrentHistoryIndex();

    function handleAdd(inputText: string, autoDate: boolean = true) {
        const node = UIHelper.handleAddHelper(inputText, tree, autoDate, "game");
        ContextManager.addNodes(tree, setTree, urlMap, setURLMap, [node]);
        ContextManager.updateHistory(history, setHistory, new Action("add", [node]));
    }

    function handleDelete(node: Game) {
        const bool = window.confirm();
        if (bool) {
            const deletedNodes = ContextManager.deleteNode(tree, setTree, node, urlMap, setURLMap);
            ContextManager.updateHistory(history, setHistory, new Action("delete", [...deletedNodes!]));
        }
    }

    function handleSettings(game: Game) {
        // let ans = prompt("SET NAME = n {name}");
        // ans = UIHelper.sanitizeUserEntry(ans!);
        // UIHelper.createNodePath(ans, "ROOT_NODE")
        // game.name = ans!;
        // game.path = ans!;
        // const newURLMap = ContextManager.createDeepCopyURLMap(urlMap);
        // setURLMap(newURLMap);
        // ContextManager.updateNode(game, tree, setTree);
        // ContextManager.updateHistory(history, setHistory, new Action("update", [game]));
    }
    useSaveDeathLogStatus(history, currentHistoryIndexRef);
    return (
        <>
            Home
            <Modal />
            <AddItemCard itemType="game" handleAdd={handleAdd} />
            {
                tree.get("ROOT_NODE")?.childIDS.map((nodeID, index) => {
                    const game = tree.get(nodeID) as Game;
                    return <Card key={index} treeNode={game} handleDelete={() => handleDelete(game)} handleSettings={() => handleSettings(game)} />
                })
            }
        </>
    )
}