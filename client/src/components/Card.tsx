import { NavLink } from "react-router"
import Subject from "../classes/Subject";
import skull from "../assets/skull.svg"
import add from "../assets/add.svg"
import minus from "../assets/minus.svg"
import step_into from "../assets/step_into.svg"
import details from "../assets/details.svg"
import reset from "../assets/reset.svg"
import Game from "../classes/Game";
import Profile from "../classes/Profile";
import useTreeContext from "../hooks/useTreeContext";

type Props = {
    treeNode: Game | Profile | Subject;
    handleDelete: () => void;
    handleSettings?: () => void;
    subjectUI?: React.JSX.Element | null;
    subjectNotableCol?: string | null;
}

export default function Card({ treeNode, handleDelete, handleSettings, subjectUI = null, subjectNotableCol = null }: Props) {

    const [tree, _] = useTreeContext();

    let deathCount: number;
    let fullTries: number;
    let resets: number;
    if (treeNode instanceof Game || treeNode instanceof Profile) {
        deathCount = treeNode.getDeaths(tree);
        fullTries = treeNode.getFullTries(tree);
        resets = treeNode.getResets(tree);
    }
    else{
        deathCount = treeNode.getDeaths();
        fullTries = treeNode.fullTries;
        resets = treeNode.resets;
    }

    return (
        <>

            <div className={`flex flex-col font-semibold text-black border-black border-4 bg-zomp p-2  rounded-xl  w-72 h-64 ${subjectNotableCol}`}>
                <div className="flex">

                    <div className="flex gap-1 border-2 rounded-2xl p-1 px-3 mb-auto max-w-52 bg-indianred">
                        <img className="w-10" src={skull} alt="" />
                        <p className="text-xl m-auto truncate">{deathCount}</p>
                    </div>


                    <div className="flex flex-col ml-auto gap-3">
                        {
                            !(treeNode instanceof Subject) ?
                                <NavLink to={`/${treeNode.path}`}>
                                    <img className="w-10" src={step_into} alt="" />
                                </NavLink>
                                :
                                <>
                                    <img className="w-10 cursor-pointer" src={add} alt="" onClick={() => console.log(1)} />
                                    <img className="w-10 cursor-pointer" src={minus} alt="" onClick={() => console.log(1)} />
                                    <img className="w-10 cursor-pointer" src={reset} alt="" onClick={() => console.log(1)} />
                                </>
                        }
                        <img className="w-10 cursor-pointer" src={details} alt="" />
                    </div>
                </div>

                <div className=" rounded-xl text-2xl mt-auto ">
                    <p className="break-words line-clamp-3">{treeNode.name}</p>
                </div>

                <div className="hidden">

                    {subjectUI}
                    <button onClick={handleSettings} className="pr-2">set</button>
                    <button onClick={handleDelete} >del</button>
                </div>

            </div>


        </>
    )
}