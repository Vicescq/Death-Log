import { useEffect, useState } from "react";
import Game from "../classes/Game";
import Card from "../components/Card";
import UtilityCard from "../components/UtilityCard";
import { useGamesContext } from "../context";

export default function Home() {

    // add init for games for persistence

    const [games, setGames] = useGamesContext();
    const [addGameText, setAddGameText] = useState("");
    const [delGameText, setDelGameText] = useState("");

    function handleAddGameBtn() {
        if (addGameText != "") {
            const newGame = new Game(addGameText, []);
            setGames((prevGames) => [...prevGames, newGame]);
        }
    }

    function handleCardDelete(targetIndex: number) {

        setGames((prevGames) => prevGames.filter(
            (_, index) => index !== targetIndex
        ));
    }



    useEffect(() => (console.log("HOME:", games)), [games])

    return (

        <>
            Home
            <UtilityCard addOrDelStr="Add game" handleBtn={handleAddGameBtn} handleTextChange={(event) => setAddGameText(event.target.value)} />

            {
                games.map(
                    (game, index) => (<Card key={index} objContext={game} index={index} handleDelete={handleCardDelete} />)
                )
            }
        </>
    )
}


