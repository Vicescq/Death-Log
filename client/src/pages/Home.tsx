import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import useGamesContext from "../hooks/useGamesContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import ContextManager from "../classes/ContextManager";
import Game from "../classes/Game";

export default function Home() {

    const [urlMap, setURLMap] = useURLMapContext();
    const [games, setGames] = useGamesContext();

    function onAdd(inputText: string) {
        if (inputText != ""){
            const game = new Game(inputText.trim(), [], inputText.trim().replaceAll(" ", "-"));
            ContextManager.addNode(games, setGames, game, games.length);
            ContextManager.addNewURLMapping(game, urlMap, setURLMap);
        }
    }

    function onDelete(node: Game, targetedGI: number) {
        ContextManager.deleteNode(games, setGames, node, node, targetedGI);
        ContextManager.deleteURLMapping(urlMap, setURLMap, node);
    }

    useConsoleLogOnStateChange(games, "HOME:", games);
    useConsoleLogOnStateChange(urlMap, "URL MAP:", urlMap);

    return (
        <>
            Home
            <AddItemCard itemType="game" onAdd={onAdd} />
            {
                games.map(
                    (game, index) => (<Card key={index} objContext={game} onDelete={() => onDelete(game, index)} onDeath={null} onReadOnly={null}/>)
                )
            }
        </>
    )
}