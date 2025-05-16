import { NavLink, useSearchParams } from "react-router"
import type Collection from "../classes/Collection"
import { useGamesContext } from "../context";
import ContextManager from "../classes/ContextManager";




export default function Card<T>({ objContext, index }: { objContext: Collection<T>, index: number}) {
    const [games, setGames] = useGamesContext();
    const strPath = ContextManager.createCardPath(objContext, useSearchParams()[0], index, games)
    

    return (
        <>
            <div className="flex rounded-lg border p-3 gap-2 ">
                <NavLink to={`/${strPath}`}>
                    <span className="cursor-pointer">{objContext.name}</span>
                </NavLink>
                <button className="border-2 p-1 border-red-400 rounded-lg bg-red-400">del</button>
            </div>
        </>
    )
}