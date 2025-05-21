import { NavLink, Outlet } from "react-router";
import ContextManager from "../classes/ContextManager";
import useGamesContext from "../hooks/useGamesContext";
import useHistoryContext from "../hooks/useHistoryContext";

export default function Root() {
    const [games, setGames] = useGamesContext();
    const [history, setHistory] = useHistoryContext()


    function load() {
        const bool = confirm("LOAD PREVIOUS STATE")
        if (bool) {
            const newGames = ContextManager.reviveGamesContext(localStorage.getItem("main")!);
            setGames(newGames);
        }

    }
    function save() {
        const bool = confirm("SAVE CURRENT STATE")
        if (bool) {
            localStorage.setItem("main", JSON.stringify(games))
        }
    }


    return (
        <>
            <div className="flex flex-col float-right gap-4 pr-6">
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black float-right" onClick={() => save()}>save</button>
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black float-right" onClick={() => load()}>load</button>
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black float-right" >Redo</button>
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black float-right" onClick={() => undoFunction()}>Undo</button>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 m-8">
                <NavLink to={"/"}>
                    <div className="border-2 p-1 rounded-md">Go back home</div>
                </NavLink>
                <Outlet />

            </div >
        </>
    )
}