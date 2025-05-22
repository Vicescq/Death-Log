import { useRef, useState } from "react";
import Game from "../classes/Game";
import Card from "../components/Card";
import UtilityCard from "../components/UtilityCard";
import useGamesContext from "../hooks/useGamesContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import useUpdateURLMap from "../hooks/useUpdateURLMap";
import ContextManager from "../classes/ContextManager";

export default function Home() {

    const [urlMap, setURLMap] = useURLMapContext();
    const [games, setGames] = useGamesContext();
    const [addGameText, setAddGameText] = useState("");
    const addedGameRef = useRef<Game | null>(null);

    function handleAddGameBtn() {
        if (addGameText != "") {
            const newGame = new Game(addGameText.trim(), [], addGameText.trim().replaceAll(" ", "-"));
            setGames((prevGames) => [...prevGames, newGame]);
            addedGameRef.current = newGame
            ContextManager.updateURLMapContext(newGame, urlMap, setURLMap);
        }
    }

    function handleCardDelete(targetIndex: number) {
        setGames((prevGames) => prevGames.filter(
            (_, index) => index !== targetIndex
        ));
    }

    useConsoleLogOnStateChange(games, "HOME:", games);
    useConsoleLogOnStateChange(urlMap, "URL MAP:", urlMap);

    return (

        <>
            Home
            <UtilityCard addOrDelStr="Add game" handleBtn={handleAddGameBtn} handleTextChange={(event) => setAddGameText(event.target.value)} />
            {
                games.map(
                    (game, index) => (<Card key={index} objContext={game} index={index} gi={index} handleDelete={handleCardDelete} />)
                )
            }
        </>
    )
}


