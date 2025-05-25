import { NavLink, Outlet, useNavigate } from "react-router";
import ContextManager from "../classes/ContextManager";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import { SignedIn, SignedOut, SignInButton, useAuth, useClerk, UserButton, useUser } from "@clerk/clerk-react";

export default function Root() {
    const navigate = useNavigate();
    const [tree, setTree] = useTreeContext();
    const [_, setURLMap] = useURLMapContext();

    function load() {
        const bool = confirm("LOAD PREVIOUS STATE")
        if (bool) {
            navigate("/");
            fetch("/api/load", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }).then(res => res.json()).then(data => {
                ContextManager.deserializeTree(data["log"], setTree, setURLMap);
            })
        }
    }

    function save() {
        const bool = confirm("SAVE CURRENT STATE")
        if (bool) {
            navigate("/");
            fetch("/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: ContextManager.serializeTree(tree)
            }).then(() => {
                console.log("Saved current tree!");
            })
        }
    }

    return (
        <>
            <div className="flex flex-col  gap-4 m-12 mx-52">
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black " onClick={() => save()}>save</button>
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black " onClick={() => load()}>load</button>
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black " >Redo</button>
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black " onClick={() => undoFunction()}>Undo</button>
            </div>
            <header className="border-4">
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>

            <div className="flex flex-col items-center justify-center gap-2 m-10">
                <NavLink to={"/"}>
                    <div className="border-2 p-1 rounded-md">Go back home</div>
                </NavLink>
                <Outlet />

            </div >
        </>
    )
}