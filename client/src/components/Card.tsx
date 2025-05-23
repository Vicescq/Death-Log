import { NavLink } from "react-router"
import Subject from "../classes/Subject";
import type Collection from "../classes/Collection";

export default function Card({ collectionNode, onDelete }: { collectionNode: Collection, onDelete: () => void}) {

    
    let strPath = collectionNode.path;

    let deathInfo = null;
    if (collectionNode.type == "subject") {
        const subjectObj = collectionNode as Subject
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
                {/* <button onClick={() => onDeath!("fullTry")} className="border-2 p-1 px-2 border-red-400 rounded-lg bg-red-400">+</button>
                <button onClick={() => onDeath!("reset")} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">~ +</button> */}
            </>

        )
    }

    return (
        <>
            <div className="flex rounded-lg border p-3 gap-2 ">
                <NavLink to={`/${strPath}`}>
                    <span className="cursor-pointer">{collectionNode.name}</span>
                </NavLink>
                {deathInfo}

                <button onClick={onDelete} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">del</button>
            </div>
        </>
    )
}