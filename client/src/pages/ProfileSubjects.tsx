import { useEffect, useState } from "react";
import Card from "../components/Card";
import UtilityCard from "../components/UtilityCard";

import Subject from "../classes/Subject";
import ContextManager from "../classes/ContextManager";
import useGamesContext from "../hooks/useGamesContext";

export default function ProfileSubjects({gi, pi}: {gi: number, pi: number}) {

    const [games, setGames] = useGamesContext();
    const [addSubjectText, setaddSubjectText] = useState("");

    function handleAddSubjectBtn() {
        if (addSubjectText != "") {
            const currProfile = games[gi].items[pi];
            const newSubject = new Subject(addSubjectText.trim(), []);
            currProfile.items.push(newSubject);
            const currGame = games[gi]

            const newArr = ContextManager.getUpdatedGamesContext(games, currGame, gi)
            setGames((prevGames) => newArr);
        }
    }

    function handleCardDelete(targetIndex: number) {
        const currGame = games[gi]
        currGame.items[pi].items.splice(targetIndex, 1);
        const newArr = ContextManager.getUpdatedGamesContext(games, currGame, gi)
        setGames((prevGames) => newArr);
    }
    

    useEffect(() => (console.log("PROFILE PAGE:", games)), [games])
    return (
        <>
            ProfileSubjects
            <UtilityCard addOrDelStr="Add game" handleBtn={handleAddSubjectBtn} handleTextChange={(event) => setaddSubjectText(event.target.value)} />

            {
                games[gi].items[pi].items.map((subject, index) => (<Card key={index} objContext={subject} index={index} gi={gi} handleDelete={handleCardDelete} />))
            }
        </>



    )
}