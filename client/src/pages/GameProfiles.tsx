import Card from "../components/Card";
import { useEffect, useState } from "react";
import Profile from "../classes/Profile";
import UtilityCard from "../components/UtilityCard";
import ContextManager from "../classes/ContextManager";
import useGamesContext from "../hooks/useGamesContext";

export default function GameProfiles({gi}: {gi: number}) {

    const [games, setGames] = useGamesContext();
    const [addProfileText, setaddProfileText] = useState("");



    function handleAddProfileBtn() {
        if (addProfileText != "") {

            const currGame = games[gi]
            const newProfile = new Profile(addProfileText.trim(), []);
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
                    (profile, index) => (<Card key={index} objContext={profile} index={index} gi={gi} handleDelete={handleCardDelete} />)
                )
            }
        </>


    )




}