import { useLocation } from "react-router";
import Card, { type IndicesType } from "../components/Card";
import { useEffect, useState } from "react";
import Profile from "../classes/Profile";
import UtilityCard from "../components/UtilityCard";
import { updateGamesContext, useGamesContext } from "../context";

export default function GameProfiles() {
    const location = useLocation();
    const { gameIndex } = location.state as IndicesType
    const [games, setGames] = useGamesContext();
    const [addProfileText, setaddProfileText] = useState("");
    const [delProfileText, setdelProfileText] = useState("");

    function handleAddProfileBtn() {
        if (addProfileText != "") {
            const currGame = games[gameIndex]
            const newProfile = new Profile(addProfileText, []);
            currGame.items.push(newProfile);
            const newArr = updateGamesContext(games, currGame, gameIndex);
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
            GameProfiles
            <UtilityCard addOrDelStr="Add game" handleBtn={handleAddProfileBtn} handleTextChange={(event) => setaddProfileText(event.target.value)} />
            <UtilityCard addOrDelStr="Delete game" handleBtn={handelDelProfileBtn} handleTextChange={(event) => setdelProfileText(event.target.value)} />
            {
                games[gameIndex].items.map(
                    (profile, index) => (<Card key={index} objContext={profile} indices={{ gameIndex: gameIndex, profileIndex: index, subjectIndex: -1 }} />)
                )
            }
        </div>
    )




}