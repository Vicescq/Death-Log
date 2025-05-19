import { NavLink, Outlet } from "react-router";
import ContextManager from "../classes/ContextManager";
import { useGamesContext } from "../context";

export default function Root() {
    const [games, setGames] = useGamesContext();

    function load() {
        const bool = confirm("LOAD PREVIOUS STATE")
        if (bool) {
            const newGames = ContextManager.reviveGamesContext(localStorage.getItem("x")!);
            setGames(newGames);
        }

    }

    function save() {
        const bool = confirm("SAVE CURRENT STATE")
        if (bool) {
            localStorage.setItem("x", JSON.stringify(games))
        }
    }

    return (
        <>
            <button className="border-1 rounded-md p-1 bg-black float-right" onClick={() => save()}>save</button>
            <button className="border-1 rounded-md p-1 bg-black float-right" onClick={() => load()}>load</button>
            <div className="flex flex-col items-center justify-center gap-2 m-8">
                <NavLink to={"/"}>
                    <div className="border-2 p-1 rounded-md">Go back home</div>
                </NavLink>
                <Outlet />

            </div >
        </>
    )
}