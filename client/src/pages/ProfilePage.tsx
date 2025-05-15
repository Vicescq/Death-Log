import { useEffect, useState } from "react";
import Card, { type IndicesType } from "../components/Card";
import UtilityCard from "../components/UtilityCard";
import { updateGamesContext, useGamesContext } from "../context";
import { useLocation } from "react-router";

import Subject from "../classes/Subject";

export default function ProfilePage() {
    const location = useLocation();
    const { gameIndex, profileIndex } = location.state as IndicesType
    const [games, setGames] = useGamesContext();
    const [addSubjectText, setaddSubjectText] = useState("");
    const [delSubjectText, setdelSubjectText] = useState("");
    
    function handleAddSubjectBtn() {
        if (addSubjectText != "") {
            const currProfile = games[gameIndex].items[profileIndex];
            const newSubject = new Subject(addSubjectText, []);
            currProfile.items.push(newSubject);
            const currGame = games[gameIndex]
            const newArr = updateGamesContext(games, currGame, gameIndex);
            setGames((prevGames) => newArr);
        }
    }

    function handelDelSubjectBtn() {
        // if (delProfileText != "") {
        //     setProfiles((prevProfiles) => prevProfiles.filter(
        //         (_, index) => index !== Number(delProfileText)
        //     ));
        // }
    }
    useEffect(() => (console.log("PROFILE PAGE:", games)), [games])
    return (
        <div className="flex items-center justify-center gap-2 m-8">
            ProfilePage
            <UtilityCard addOrDelStr="Add game" handleBtn={handleAddSubjectBtn} handleTextChange={(event) => setaddSubjectText(event.target.value)} />
            <UtilityCard addOrDelStr="Delete game" handleBtn={handelDelSubjectBtn} handleTextChange={(event) => setdelSubjectText(event.target.value)} />
            {
                games[gameIndex].items[profileIndex].items.map((subject, index) => (<Card key={index} objContext={subject} indices={{gameIndex: gameIndex, profileIndex: profileIndex, subjectIndex: index}} />))
            }
            
        </div>
    )
}