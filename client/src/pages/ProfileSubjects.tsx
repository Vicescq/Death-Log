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
    const [urlMap, setURLMap] = useURLMapContext();

    const gi = games.findIndex((game) => game.id == gameID)
    const pi = games[gi].items.findIndex((profile) => profile.id == profileID)

    function onAdd(inputText: string) {
        if (inputText != "") {
            const path = games[gi].items[pi].path + "/" + inputText.trim().replaceAll(" ", "-");
            const newSubject = new Subject(inputText.trim(), [], path);
            ContextManager.addNode(games, setGames, games[gi], newSubject, gi, pi);
            ContextManager.addNewURLMapping(newSubject, urlMap, setURLMap, gameID, profileID);
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
            <AddItemCard onAdd={onAdd} itemType="profile"/>

            {
                games[gi].items[pi].items.map((subject, index) => (<Card key={index} objContext={subject} onDelete={() => handleCardDelete} />))
            }
        </>



    )
}