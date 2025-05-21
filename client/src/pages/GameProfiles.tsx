import Card from "../components/Card";
import { useEffect, useRef, useState } from "react";
import Profile from "../classes/Profile";
import UtilityCard from "../components/UtilityCard";
import ContextManager from "../classes/ContextManager";
import useGamesContext from "../hooks/useGamesContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import useUpdatedURLMap from "../hooks/useUpdatedURLMap";

export default function GameProfiles({ gameID }: { gameID: string }) {
    const [urlMap, setURLMap] = useURLMapContext();
    const [games, setGames] = useGamesContext();
    const [addProfileText, setaddProfileText] = useState("");
    const newProfileRef = useRef<Profile | null>(null);
    
    const gi = games.findIndex((game) => game.id == gameID)

    function handleAddProfileBtn() {
        if (addProfileText != "") {

            const currGame = games[gi]
            const path = currGame.path + "/" + addProfileText.trim().replaceAll(" ", "-");
            const newProfile = new Profile(addProfileText.trim(), [], path);
            newProfileRef.current = newProfile;
            currGame.items.push(newProfile);
            const newArr = ContextManager.getUpdatedGamesContext(games, currGame, gi)
            setGames((prevGames) => newArr);
        }
    }

    function handleCardDelete(targetIndex: number) {
        const currGame = games[gi]
        currGame.items.splice(targetIndex, 1);
        const newArr = ContextManager.getUpdatedGamesContext(games, currGame, gi)
        setGames((prevGames) => newArr);
    }

    useUpdatedURLMap(games, newProfileRef, urlMap, setURLMap, gameID);
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