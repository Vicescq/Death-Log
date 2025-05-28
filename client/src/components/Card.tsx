import { NavLink } from "react-router"
import Subject, { type DeathType } from "../classes/Subject";
import skull from "../assets/skull.svg"
import add from "../assets/add.svg"
import minus from "../assets/minus.svg"
import step_into from "../assets/step_into.svg"
import details from "../assets/details.svg"
import reset from "../assets/reset.svg"
import readonly from "../assets/readonly.svg"
import Game from "../classes/Game";
import Profile from "../classes/Profile";
import type { TreeStateType } from "../contexts/treeContext";
import { useState } from "react";

export type HandleDeathCountOperation = "add" | "subtract";

type Props = {
    tree: TreeStateType;
    treeNode: Game | Profile | Subject;
    handleDelete: () => void;
    handleDetails?: () => void;
    handleDeathCount?: (deathType: DeathType, operation: HandleDeathCountOperation) => void;
    handleCompletedStatus?: (newStatus: boolean) => void;
}

export default function Card({ tree, treeNode, handleDelete, handleDetails, handleDeathCount, handleCompletedStatus }: Props) {

    const enabledCSS = "bg-amber-200 border-2 rounded-2xl shadow-[5px_2px_0px_rgba(0,0,0,1)]";
    const [resetDeathTypeMode, setResetDeathTypeMode] = useState(false);

    const cardCSS = treeNode.completed ? "bg-raisinblack text-amber-200" : "bg-zomp text-black";
    const readOnlyToggleCSS = treeNode.completed ? enabledCSS : "";
    const resetToggleCSS = resetDeathTypeMode ? enabledCSS : "";
    const settersBtnDisplay = treeNode.completed ? "hidden" : "";
    const detailsReadOnlyCSS = treeNode.completed ? "bg-amber-200 rounded-l shadow-[5px_2px_0px_rgba(0,0,0,1)]" : "";
    const deathType = resetDeathTypeMode ? "reset" : "fullTry";

    const deathCount = treeNode instanceof Game || treeNode instanceof Profile ? treeNode.getDeaths(tree) : treeNode.getDeaths();
    const fullTries = treeNode instanceof Game || treeNode instanceof Profile ? treeNode.getFullTries(tree) : treeNode.fullTries;
    const resets = treeNode instanceof Game || treeNode instanceof Profile ? treeNode.getResets(tree) : treeNode.resets;

    return (
        <>
            <div className={`flex font-semibold border-black border-4 ${cardCSS} p-2  rounded-xl w-72 h-72 shadow-[10px_8px_0px_rgba(0,0,0,1)] hover:shadow-[20px_10px_0px_rgba(0,0,0,1)]`}>
                <div className="flex flex-col w-52">

                    <div className="flex gap-1  p-1 px-3 bg-indianred border-2 rounded-2xl border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <img className="w-10" src={skull} alt="" />
                        <p className="text-xl mt-auto mb-auto truncate ">{deathCount}</p>
                    </div>

                    <div className=" rounded-xl text-2xl mt-auto">
                        <p className="break-words line-clamp-4">{treeNode.name}</p>
                    </div>

                </div>

                <div className="flex flex-col gap-3 ml-auto">
                    {
                        !(treeNode instanceof Subject) ?
                            <NavLink to={`/${treeNode.path}`}>
                                <img className="w-10" src={step_into} alt="" />
                            </NavLink>
                            :
                            <>
                                <img className={`w-10 cursor-pointer ${settersBtnDisplay}`} src={add} alt="" onClick={() => handleDeathCount!(deathType, "add")} />
                                <img className={`w-10 cursor-pointer ${settersBtnDisplay}`} src={minus} alt="" onClick={() => handleDeathCount!(deathType, "subtract")} />
                                <img className={`w-10 cursor-pointer ${settersBtnDisplay}  ${resetToggleCSS}`} src={reset} alt="" onClick={() => {
                                    setResetDeathTypeMode((prev) => !prev);
                                }} />
                            </>
                    }
                    <img className={`w-10 cursor-pointer ${detailsReadOnlyCSS}`} src={details} alt="" onClick={handleDelete}/>
                    <img className={`w-10 cursor-pointer ${readOnlyToggleCSS}`} src={readonly} alt="" onClick={() => {
                        handleCompletedStatus!(!treeNode.completed);
                    }} />
                </div>
            </div>


        </>
    )
}