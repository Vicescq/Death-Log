import { NavLink } from "react-router"
import type TreeNode from "../classes/Collection";
import Subject from "../classes/Subject";

type Props = {
    treeNode: TreeNode;
    handleDelete: () => void;
    subjectUI?: React.JSX.Element | null;
    subjectNotableCol?: string | null;
}

export default function Card({ treeNode, handleDelete, subjectUI = null, subjectNotableCol = null }: Props) {

    return (
        <>
            <div className={`flex rounded-lg border p-3 gap-2  ${subjectNotableCol}`}>

                {treeNode instanceof Subject ?
                    (<span className="cursor-pointer">{treeNode.name}</span>)
                    : <NavLink to={`/${treeNode.path}`}>
                        <span className="cursor-pointer">{treeNode.name}</span>
                    </NavLink>
                }
                {subjectUI}

                <button onClick={handleDelete} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">del</button>
            </div>
        </>
    )
}