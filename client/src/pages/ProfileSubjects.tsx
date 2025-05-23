import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";

import Subject from "../classes/Subject";
import ContextManager from "../classes/ContextManager";
import useGamesContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import type { DeathType } from "../classes/Death";
import Death from "../classes/Death";
import { useState } from "react";

export default function ProfileSubjects({ gameID, profileID }: { gameID: string, profileID: string }) {

    const [games, setGames] = useGamesContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [readOnly, setReadOnly] = useState(false);

    const gi = games.findIndex((game) => game.id == gameID)
    const pi = games[gi].items.findIndex((profile) => profile.id == profileID)

    function onAdd(inputText: string) {
        if (inputText != "") {
            const path = games[gi].items[pi].path + "/" + inputText.trim().replaceAll(" ", "-");
            const newSubject = new Subject(inputText.trim(), [], path);
            ContextManager.addNode(games, setGames, newSubject, gi, pi);
            ContextManager.addNewURLMapping(newSubject, urlMap, setURLMap, gameID, profileID);
        }
    }

    function onDelete(node: Subject) {
            ContextManager.deleteNode(games, setGames, games[gi], node, gi, pi);
            ContextManager.deleteURLMapping(urlMap, setURLMap, node);
        }

    function onDeath(type: DeathType, subject: Subject) {
        if (readOnly){
            let newDeath: Death;
            if (type == "fullTry") {
                newDeath = new Death()
                subject.items.push(newDeath)
            }
            else {
                newDeath = new Death(null, [], "reset")
                subject.items.push(newDeath);
            }
            ContextManager.addNode(games, setGames, newDeath, gi, pi);
        }
    }

    function onReadOnly(){
        setReadOnly((prev) => !prev)
    }

    useConsoleLogOnStateChange(games, "PROFILE PAGE:", games);

    return (
        <>
            ProfileSubjects
            <AddItemCard onAdd={onAdd} itemType="profile"/>
            {
                games[gi].items[pi].items.map((subject, index) => (<Card key={index} objContext={subject} onDelete={() => onDelete(subject) } onDeath={(type) => onDeath(type, subject)} onReadOnly={() => onReadOnly()} />))
            }
        </>
    )
}