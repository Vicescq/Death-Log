import { NavLink } from "react-router"
import grimpReaper from "../assets/grim-reaper.png"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"

export default function NavBar() {

    return (
        <nav className="bg-zomp text-black p-1 px-5 ">
            <ul className="flex gap-3 justify-center ">
                <li>
                    <NavLink to="/">
                        <img src={grimpReaper} className="w-8" />
                    </NavLink>
                </li>
                <li className="ml-auto ">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                </li>
            </ul>
        </nav>
    )
}