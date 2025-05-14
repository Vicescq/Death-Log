import { useEffect, useState } from "react";
import Game from "../classes/Game";
import Card from "../components/Card";
import UtilityCard from "../components/UtilityCard";
import StateLogger from "../classes/StateLogger";
import GameProfiles from "./GameProfiles";
import Container from "../components/Container";

export default function Home() {

    // add init for games for persistence

    const [games, setGames] = useState<Game[]>([]);
    const [addGameText, setAddGameText] = useState("");
    const [delGameText, setDelGameText] = useState("");

    function handleAddGameBtn() {
        if (addGameText != "") {
            const newGame = new Game(addGameText, []);
            setGames((prevGames) => [...prevGames, newGame]);
        }
    }

    function handelDelGameBtn() {
        if (delGameText != "") {
            setGames((prevGames) => prevGames.filter(
                (_, index) => index !== Number(delGameText)
            ));
        }
    }



    // useEffect(() => {
    //     const stateLogger = new StateLogger(games);
    //     // localStorage.setItem("state", JSON.stringify(stateLogger.stateLog))

    // }, [games])
    

    return (

        <div className="flex items-center justify-center gap-2 m-8">
            <UtilityCard addOrDelStr="Add game" handleBtn={handleAddGameBtn} handleTextChange={(event) => setAddGameText(event.target.value)} />
            <UtilityCard addOrDelStr="Delete game" handleBtn={handelDelGameBtn} handleTextChange={(event) => setDelGameText(event.target.value)} />
            {
                games.map(
                    (game, index) => (<Card key={index} objContext={game} />)
                )
            }
        </div>
    )
}


