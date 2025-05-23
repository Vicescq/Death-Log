import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Game from "../classes/Game";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";

export default function Home() {

    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();

    function handleAdd(inputText: string) {
        if (inputText != ""){
            const path = inputText.trim().replaceAll(" ", "-");
            const game = new Game(inputText.trim(), path, "ROOT_NODE");
            ContextManager.addNode(tree, setTree, game, urlMap, setURLMap);
        }
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
                    return <Card key={index} collectionNode={game} handleDelete={() => handleDelete(game)}/>
                })
            }
        </>
    )
}