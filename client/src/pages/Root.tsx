import { NavLink, Outlet } from "react-router";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";


export default function Root() {

    return (
        <>
            <div className="flex flex-col  gap-4 m-12 mx-52">
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black " >Redo</button>
                <button className="cursor-pointer border-1 rounded-md p-1 bg-black " >Undo</button>
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