import Card from "../components/Card";
import { useState } from "react";
import AddItemCard from "../components/AddItemCard";
import useGamesContext from "../hooks/useGamesContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import ContextManager from "../classes/ContextManager";
import Profile from "../classes/Profile";

export default function GameProfiles({ gameID }: { gameID: string }) {
    const [urlMap, setURLMap] = useURLMapContext();
    const [games, setGames] = useGamesContext();
    
    const gi = games.findIndex((game) => game.id == gameID)

    function onAdd(inputText: string) {
        const newProfile = new Profile(inputText.trim(), [], games[gi].path + "/" + inputText.trim().replaceAll(" ", "/"))
        ContextManager.addNode(games, setGames, games[gi], newProfile, gi);
        ContextManager.addNewURLMapping(newProfile, urlMap, setURLMap, gameID)
    }

    function onDelete() {
    }

    useConsoleLogOnStateChange(games, "GAME PROFILES:", games);

    return (
        <>
            GameProfiles
            <AddItemCard itemType="profile" onAdd={onAdd} />
            {
                games[gi].items.map(
                    (profile, index) => (<Card key={index} objContext={profile} onDel={onDelete}/>)
                )
            }
        </>
    )
}