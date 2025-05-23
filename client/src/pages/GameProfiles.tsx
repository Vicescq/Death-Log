import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import ContextManager from "../classes/ContextManager";
import Profile from "../classes/Profile";
import useTreeContext from "../hooks/useTreeContext";
import type Game from "../classes/Game";

export default function GameProfiles({ gameID }: { gameID: string }) {
    const [tree, setTree] = useTreeContext();
    

    function onAdd(inputText: string) {
        if(inputText != ""){
            inputText = inputText.trim();
            const node = tree.get(gameID);
            const currentGame = node as Game;
            const path = currentGame.path + "/" + inputText
            const profile = new Profile(inputText, path, ["ROOT_NODE", gameID]);
            ContextManager.addNode(tree, setTree, profile);
        }
    }

    function onDelete(node: Profile) {
        ContextManager.deleteNode(games, setGames, games[gi], node, gi);
    }

    

    return (
        <>
            GameProfiles
            <AddItemCard itemType="profile" onAdd={onAdd} />
            
        </>
    )
}