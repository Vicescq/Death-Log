import { useRef, useState } from "react";
import Card from "../components/Card";
import UtilityCard from "../components/UtilityCard";

import Subject from "../classes/Subject";
import ContextManager from "../classes/ContextManager";
import useGamesContext from "../hooks/useGamesContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import useUpdatedURLMap from "../hooks/useUpdatedURLMap";

export default function ProfileSubjects({gameID, profileID}: {gameID: string, profileID: string}) {

    const [games, setGames] = useGamesContext();
    const [addSubjectText, setaddSubjectText] = useState("");
    const [urlMap, setURLMap] = useURLMapContext();
    const newSubjectRef = useRef<Subject | null>(null);

    const gi = games.findIndex((game) => game.id == gameID)
    const pi = games[gi].items.findIndex((profile) => profile.id == profileID)

    function handleAddSubjectBtn() {
        if (addSubjectText != "") {
            const currProfile = games[gi].items[pi];
            const path = currProfile.path + "/" + addSubjectText.trim().replaceAll(" ", "-");
            console.log("path FIRST", path)
            const newSubject = new Subject(addSubjectText.trim(), [], path);
            console.log("path SECOND", newSubject.path)
            currProfile.items.push(newSubject);
            newSubjectRef.current = newSubject;
            const currGame = games[gi]

            const newArr = ContextManager.getUpdatedGamesContext(games, currGame, gi)
            setGames(newArr);
        }
    }

    function handleCardDelete(targetIndex: number) {
        const currGame = games[gi]
        currGame.items[pi].items.splice(targetIndex, 1);
        const newArr = ContextManager.getUpdatedGamesContext(games, currGame, gi)
        setGames((prevGames) => newArr);
    }
    
    useUpdatedURLMap(games, newSubjectRef, urlMap, setURLMap, gameID, profileID);
    useConsoleLogOnStateChange(games, "PROFILE PAGE:", games);

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