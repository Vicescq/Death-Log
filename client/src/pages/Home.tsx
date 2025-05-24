import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Game from "../classes/Game";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";

export default function Home() {

    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();

    function handleAdd(inputText: string, autoDate: boolean = true) {
        UIHelper.handleAddHelper(inputText, tree, setTree, urlMap, setURLMap, autoDate, "game");
    }

    function handleDelete(node: Game) {
        ContextManager.deleteNode(tree, setTree, node, urlMap, setURLMap);
    }

    return (
        <>
            Home
            <AddItemCard itemType="game" handleAdd={handleAdd} />
            {
                tree.get("ROOT_NODE")?.childIDS.map((nodeID, index) => {
                    const game = tree.get(nodeID) as Game;
                    return <Card key={index} collectionNode={game} handleDelete={() => handleDelete(game)} />
                })
            }
        </>
    )
}