import { NavLink } from "react-router"
import type Collection from "../classes/Collection"
import ContextManager from "../classes/ContextManager";
import Subject from "../classes/Subject";
import Death from "../classes/Death";
import useGamesContext from "../hooks/useGamesContext";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";

export default function Card<T>({ objContext, index, gi, handleDelete }: { objContext: Collection<T>, index: number, gi: number, handleDelete: (delIndex: number) => void }) {
    const [games, setGames] = useGamesContext();
    let strPath = objContext.path;


    let deathInfo = null;
    if (objContext instanceof Subject) {
        const subjectObj = objContext as Subject
        deathInfo = (
            <>
                <div>{subjectObj.getCount()}</div>
                {subjectBtns()}
            </>
        )
    }

    function handleDeathCount(type: string = "fulltry") {
        if (objContext instanceof Subject) {
            const currGame = games[gi];
            const subjectObj = objContext as Subject;
            if (type == "fulltry") {
                subjectObj.items.push(new Death())
            }
            else {
                subjectObj.items.push(new Death())
            }

            const newGame = ContextManager.getUpdatedGamesContext(games, currGame, gi);
            setGames((prev) => newGame);
        }
    }

    function subjectBtns() {
        return (
            <>
                <button onClick={() => handleDeathCount()} className="border-2 p-1 px-2 border-red-400 rounded-lg bg-red-400">+</button>
                <button onClick={() => handleDeathCount("reset")} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">~ +</button>
            </>

        )
    }
    useConsoleLogOnStateChange(null, strPath);
    return (
        <>
            <div className="flex rounded-lg border p-3 gap-2 ">
                <NavLink to={`/${strPath}`}>
                    <span className="cursor-pointer">{objContext.name}</span>
                </NavLink>
                {deathInfo}

                <button onClick={() => handleDelete(index)} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">del</button>


            </div>
        </>
    )
}