import { NavLink } from "react-router"
import type Collection from "../classes/Collection";

interface CardProps {
    collectionNode: Collection;
    handleDelete: () => void;
    subjectUI?: React.JSX.Element | null;
}

export default function Card({ collectionNode, handleDelete, subjectUI = null }: CardProps) {
    return (
        <>
            <div className="flex rounded-lg border p-3 gap-2 ">
                <NavLink to={`/${collectionNode.path}`}>
                    <span className="cursor-pointer">{collectionNode.name}</span>
                </NavLink>
                {subjectUI}

                <button onClick={handleDelete} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">del</button>
            </div>
        </>
    )
}