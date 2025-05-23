import { NavLink, Outlet } from "react-router";
import ContextManager from "../classes/ContextManager";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";

export default function Root() {

    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();

    function load() {
        const bool = confirm("LOAD PREVIOUS STATE")
        if (bool) {
            console.log(localStorage.getItem("main"));
            ContextManager.deserializeTree(localStorage.getItem("main")!, setTree, setURLMap);
        }

    }
    function save() {
        const bool = confirm("SAVE CURRENT STATE")
        if (bool) {
            localStorage.setItem("main", ContextManager.serializeTree(tree));
        }
    }


    return (
        <>
            <div className="flex flex-col float-right gap-4 pr-6">
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black float-right" onClick={() => save()}>save</button>
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black float-right" onClick={() => load()}>load</button>
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black float-right" >Redo</button>
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black float-right" onClick={() => undoFunction()}>Undo</button>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 m-8">
                <NavLink to={"/"}>
                    <div className="border-2 p-1 rounded-md">Go back home</div>
                </NavLink>
                <Outlet />

            </div >
        </>
    )
}