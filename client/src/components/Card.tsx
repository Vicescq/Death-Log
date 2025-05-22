import { NavLink } from "react-router"
import ContextManager from "../classes/ContextManager";
import Subject from "../classes/Subject";
import Death from "../classes/Death";
import type TreeNode from "../classes/TreeNode";

export default function Card({ objContext, onDel }: { objContext: TreeNode, onDel: () => void }) {

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

            const newGame = ContextManager.updateGamesContext(games, currGame, gi);
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

    return (
        <>
            <div className="flex rounded-lg border p-3 gap-2 ">
                <NavLink to={`/${strPath}`}>
                    <span className="cursor-pointer">{objContext.name}</span>
                </NavLink>
                {deathInfo}

                <button onClick={onDel} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">del</button>


            </div>
        </>
    )
}