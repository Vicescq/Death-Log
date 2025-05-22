import { NavLink } from "react-router"
import Subject from "../classes/Subject";
import { type DeathType } from "../classes/Death";
import type TreeNode from "../classes/TreeNode";

export default function Card({ objContext, onDelete, onDeath }: { objContext: TreeNode, onDelete: () => void, onDeath: ((deathType: DeathType) => void) | null }) {

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

    function subjectBtns() {
        return (
            <>
                <button onClick={() => onDeath!("fullTry")} className="border-2 p-1 px-2 border-red-400 rounded-lg bg-red-400">+</button>
                <button onClick={() => onDeath!("reset")} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">~ +</button>
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

                <button onClick={onDelete} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">del</button>


            </div>
        </>
    )
}