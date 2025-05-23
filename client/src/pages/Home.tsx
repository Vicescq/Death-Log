import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Game from "../classes/Game";
import useTreeContext from "../hooks/useTreeContext";
import type Collection from "../classes/Collection";
import useURLMapContext from "../hooks/useURLMapContext";

export default function Home() {

    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();

    function onAdd(inputText: string) {
        if (inputText != ""){
            const path = inputText.trim().replaceAll(" ", "-");
            const game = new Game(inputText.trim(), path, ["ROOT_NODE"]);
            ContextManager.addNode(tree, setTree, game, urlMap, setURLMap);
        }
    }

    function onDelete(node: Game) {
        ContextManager.deleteNode(tree, setTree, node);
    }



    return (
        <>
            Home
            <AddItemCard itemType="game" onAdd={onAdd} />
            {
                tree.get("ROOT_NODE")?.childIDS.map((nodeID, index) => {
                    const collectionNode = tree.get(nodeID)! as Collection;
                    return <Card key={index} collectionNode={collectionNode} onDelete={() => onDelete(collectionNode)}/>
                })
            }
        </>
    )
}