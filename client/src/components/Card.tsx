import { NavLink, useSearchParams } from "react-router"
import type Collection from "../classes/Collection"
import { useGamesContext } from "../context";
import ContextManager from "../classes/ContextManager";
import Subject from "../classes/Subject";
import { useEffect, useState } from "react";
import Death from "../classes/Death";




export default function Card<T>({ objContext, index, handleDelete }: { objContext: Collection<T>, index: number, handleDelete: (delIndex: number) => void }) {
    const [games, setGames] = useGamesContext();
    const strPath = ContextManager.createCardPath(objContext, useSearchParams()[0], index, games)
    const [deathDisplay, setDeathDisplay] = useState(false);
    const gi = Number(useSearchParams()[0].get("gi")!)

    let deathInfo = null;
    if(deathDisplay && objContext instanceof Subject){
        const subjectObj = objContext as Subject 
        deathInfo = (<div>{subjectObj.count}</div>)
    }
    function handleDeathDisplay() {
        if (objContext instanceof Subject) {
            setDeathDisplay((prev) => !prev);
            const currGame = games[gi];
            const subjectObj = objContext as Subject;
            subjectObj.count += 1;
            const newGame = ContextManager.getUpdatedGamesContext(games, currGame, index); 
            setGames((prev) => newGame);
        }
    }

    useEffect(() => console.log(deathDisplay), [deathDisplay]);

    return (
        <>
            <div onClick={handleDeathDisplay} className="flex rounded-lg border p-3 gap-2 ">
                <NavLink to={`${strPath}`}>
                    <span className="cursor-pointer">{objContext.name}</span>
                </NavLink>
                <button onClick={() => handleDelete(index)} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">del</button>
                {deathInfo}
                
            </div>
        </>
    )
}