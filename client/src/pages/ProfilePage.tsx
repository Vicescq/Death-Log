import { useEffect, useState } from "react";
import Card from "../components/Card";
import UtilityCard from "../components/UtilityCard";
import { useGamesContext } from "../context";

import Subject from "../classes/Subject";
import ContextManager from "../classes/ContextManager";
import { useSearchParams } from "react-router";

export default function ProfilePage() {

    const [games, setGames] = useGamesContext();
    const [addSubjectText, setaddSubjectText] = useState("");
    const [delSubjectText, setdelSubjectText] = useState("");
    const [currentCardPathParamsObj] = useSearchParams()
    const gi = Number(currentCardPathParamsObj.get("gi")!)
    const pi = Number(currentCardPathParamsObj.get("pi")!)

    function handleAddSubjectBtn() {
        if (addSubjectText != "") {
            const currProfile = games[gi].items[pi];
            const newSubject = new Subject(addSubjectText, []);
            currProfile.items.push(newSubject);
            const currGame = games[gi]

            const newArr = ContextManager.getUpdatedGamesContext(games, currGame, gi)
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
        <>
            ProfilePage
            <UtilityCard addOrDelStr="Add game" handleBtn={handleAddSubjectBtn} handleTextChange={(event) => setaddSubjectText(event.target.value)} />

            {
                games[gi].items[pi].items.map((subject, index) => (<Card key={index} objContext={subject} index={index} />))
            }
        </>



    )
}