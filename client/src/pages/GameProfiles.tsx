import Card from "../components/Card";
import { useEffect, useState } from "react";
import Profile from "../classes/Profile";
import UtilityCard from "../components/UtilityCard";
import { useGamesContext } from "../context";
import ContextManager from "../classes/ContextManager";
import { useSearchParams } from "react-router";

export default function GameProfiles() {

    const [games, setGames] = useGamesContext();
    const [addProfileText, setaddProfileText] = useState("");
    const [currentCardPathParamsObj] = useSearchParams()
    const gi = Number(currentCardPathParamsObj.get("gi")!)

    function handleAddProfileBtn() {
        if (addProfileText != "") {

            const currGame = games[gi]
            const newProfile = new Profile(addProfileText, []);
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

    useEffect(() => (console.log("GAME PROFILES:", games)), [games])



    return (
        <>
            GameProfiles
            <UtilityCard addOrDelStr="Add game" handleBtn={handleAddProfileBtn} handleTextChange={(event) => setaddProfileText(event.target.value)} />
            {
                games[gi].items.map(
                    (profile, index) => (<Card key={index} objContext={profile} index={index} handleDelete={handleCardDelete} />)
                )
            }
        </>


    )




}