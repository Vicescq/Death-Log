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
            <div className={`flex bg-zomp text-black border-black border-2  rounded-xl  p-3 w-72 h-64 ${subjectNotableCol}`}>

                {treeNode instanceof Subject ?
                    (<span className="cursor-pointer">{treeNode.name}</span>)
                    : <NavLink to={`/${treeNode.path}`}>
                        <span className="cursor-pointer">{treeNode.name}</span>
                    </NavLink>
                }
                {subjectUI}
                <button onClick={handleSettings} className="pr-2">set</button>
                <button onClick={handleDelete} >del</button>
            </div>
        </>
    )
}