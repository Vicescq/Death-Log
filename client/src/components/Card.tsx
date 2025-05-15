import { NavLink, useLocation } from "react-router"
import type Collection from "../classes/Collection"
import Game from "../classes/Game"
import Profile from "../classes/Profile";
import { useGamesContext } from "../context";


export type IndicesType = {
    gameIndex: number;
    profileIndex: number;
    subjectIndex: number;
}

export default function Card<T>({ objContext, indices }: { objContext: Collection<T>, indices: IndicesType }) {
    const [games, setGames] = useGamesContext();
    let strPath;
    if(objContext instanceof Game){
        strPath = objContext.name;
    }

    if(objContext instanceof Profile){
        strPath = games[indices.gameIndex].name + "/" + objContext.name
    }


    return (
        <>
            <NavLink to={`/${strPath}`} state={indices}>
                <div className="flex rounded-lg border p-3 gap-2 cursor-pointer">
                    {objContext.name}
                </div>
            </NavLink>
        </>
    )
}