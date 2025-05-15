import { useLocation } from "react-router";
import Card from "../components/Card";
import Game from "../classes/Game";
import { reconstructCollection, updateGameContext } from "../utils";
import { useEffect, useState } from "react";
import Profile from "../classes/Profile";
import UtilityCard from "../components/UtilityCard";
import { useGamesContext } from "../context";

export default function GameProfiles() {
    const location = useLocation();

    const index = location.state.index
    const [games, setGames] = useGamesContext();
    const [addProfileText, setaddProfileText] = useState("");
    const [delProfileText, setdelProfileText] = useState("");



    function handleAddProfileBtn() {
        if (addProfileText != "") {
            const currGame = games[index]
            const newProfile = new Profile(addProfileText, []);
            currGame.items.push(newProfile);
            const newArr = updateGameContext(games, currGame, index);
            setGames((prevGames) => newArr);
        }
    }

    function handelDelProfileBtn() {
        // if (delProfileText != "") {
        //     setProfiles((prevProfiles) => prevProfiles.filter(
        //         (_, index) => index !== Number(delProfileText)
        //     ));
        // }
    }

    useEffect(() => (console.log("GAME PROFILES:", games)), [games])


    
    return (
        <div className="flex items-center justify-center gap-2 m-8">
            <UtilityCard addOrDelStr="Add game" handleBtn={handleAddProfileBtn} handleTextChange={(event) => setaddProfileText(event.target.value)} />
            <UtilityCard addOrDelStr="Delete game" handleBtn={handelDelProfileBtn} handleTextChange={(event) => setdelProfileText(event.target.value)} />

            {
                games[index].items.map(
                    (profile, index) => (<Card key={index} objContext={profile} index={index} />)
                )
            }
        </div>
    )




}