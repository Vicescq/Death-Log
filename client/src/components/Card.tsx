import { NavLink } from "react-router"
import Subject from "../classes/Subject";
import type TreeNode from "../classes/TreeNode";

type Props = {
    treeNode: TreeNode;
    handleDelete: () => void;
    handleSettings?: () => void;
    subjectUI?: React.JSX.Element | null;
    subjectNotableCol?: string | null;
}

export default function Card({ treeNode, handleDelete, handleSettings, subjectUI = null, subjectNotableCol = null }: Props) {

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
                <button onClick={handleSettings} className="border-2 p-1 rounded-lg bg-emerald-800">set</button>
                <button onClick={handleDelete} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">del</button>
            </div>
        </>
    )
}