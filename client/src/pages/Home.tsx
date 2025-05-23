import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import ContextManager from "../classes/ContextManager";
import Game from "../classes/Game";
import useTreeContext from "../hooks/useTreeContext";
import type Collection from "../classes/Collection";

export default function Home() {

    const [tree, setTree] = useTreeContext();

    function onAdd(inputText: string) {
        if (inputText != ""){
            const game = new Game(inputText.trim(), inputText.trim().replaceAll(" ", "-"), "ROOT_NODE");
            ContextManager.addNode(tree, setTree, game);
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