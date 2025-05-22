import { useState } from "react";
import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";

import Subject from "../classes/Subject";
import ContextManager from "../classes/ContextManager";
import useGamesContext from "../hooks/useGamesContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";

export default function ProfileSubjects({ gameID, profileID }: { gameID: string, profileID: string }) {

    const [games, setGames] = useGamesContext();
    const [addSubjectText, setaddSubjectText] = useState("");
    const [urlMap, setURLMap] = useURLMapContext();

    const gi = games.findIndex((game) => game.id == gameID)
    const pi = games[gi].items.findIndex((profile) => profile.id == profileID)

    function handleAddSubjectBtn() {
        if (addSubjectText != "") {
            const currProfile = games[gi].items[pi];
            const path = currProfile.path + "/" + addSubjectText.trim().replaceAll(" ", "-");
            const newSubject = new Subject(addSubjectText.trim(), [], path);
            ContextManager.addNewURLMapping(newSubject, urlMap, setURLMap, gameID, profileID);
            currProfile.items.push(newSubject);
            const currGame = games[gi]
            ContextManager.updateGamesContext(games, setGames, currGame, gi)
        }
    }

    function handleCardDelete(targetIndex: number) {
        const currGame = games[gi]
        currGame.items[pi].items.splice(targetIndex, 1);
        const newArr = ContextManager.updateGamesContext(games, currGame, gi)
        setGames((prevGames) => newArr);
    }

    useConsoleLogOnStateChange(games, "PROFILE PAGE:", games);

    return (
        <>
            ProfileSubjects
            <AddItemCard addOrDelStr="Add game" handleBtn={handleAddSubjectBtn} handleTextChange={(event) => setaddSubjectText(event.target.value)} />

            {
                games[gi].items[pi].items.map((subject, index) => (<Card key={index} objContext={subject} index={index} gi={gi} handleDelete={handleCardDelete} />))
            }
        </>



    )
}