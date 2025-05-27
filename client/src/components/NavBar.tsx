import { NavLink } from "react-router"
import grimpReaper from "../assets/grim-reaper.png"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"

export default function NavBar() {

    return (
        <nav className="bg-zomp text-black  px-2 ">
            <ul className="flex gap-3 justify-center ">
                <li className="m-2">
                    <NavLink to="/">
                        <img src={grimpReaper} className="w-7" />
                    </NavLink>
                </li>
                <li>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                </li>
                <li className="ml-auto m-2">
                    <SignedIn>
                        <UserButton appearance={{ elements: { rootBox: "m-0.75" } }} />
                    </SignedIn>
                </li>


            </ul>
        </nav>
    )
}