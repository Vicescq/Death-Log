import Card from "../components/Card";
import { useState } from "react";
import Profile from "../classes/Profile";
import UtilityCard from "../components/UtilityCard";
import ContextManager from "../classes/ContextManager";
import useGamesContext from "../hooks/useGamesContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";

export default function GameProfiles({ gameID }: { gameID: string }) {
    const [urlMap, setURLMap] = useURLMapContext();
    const [games, setGames] = useGamesContext();
    const [addProfileText, setaddProfileText] = useState("");
    
    const gi = games.findIndex((game) => game.id == gameID)

    function handleAddProfileBtn() {
        if (addProfileText != "") {

            const currGame = games[gi]
            const path = currGame.path + "/" + addProfileText.trim().replaceAll(" ", "-");
            const newProfile = new Profile(addProfileText.trim(), [], path);
            ContextManager.updateURLMapContext(newProfile, urlMap, setURLMap, gameID);
            currGame.items.push(newProfile);
            const newArr = ContextManager.updateGamesContext(games, currGame, gi)
            setGames((prevGames) => newArr);
        }
    }

    function handleCardDelete(targetIndex: number) {
        const currGame = games[gi]
        currGame.items.splice(targetIndex, 1);
        const newArr = ContextManager.updateGamesContext(games, currGame, gi)
        setGames((prevGames) => newArr);
    }

    useConsoleLogOnStateChange(games, "GAME PROFILES:", games);

    return (
        <>
            GameProfiles
            <UtilityCard addOrDelStr="Add game" handleBtn={handleAddProfileBtn} handleTextChange={(event) => setaddProfileText(event.target.value)} />
            {
                games[gi].items.map(
                    (profile, index) => (<Card key={index} objContext={profile} index={index} gi={gi} handleDelete={handleCardDelete} />)
                )
            }
        </>


    )




}