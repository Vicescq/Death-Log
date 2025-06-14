import { NavLink } from "react-router";
import grimpReaper from "../assets/grim-reaper.png";
import info from "../assets/info.svg";
import { auth } from "../firebase-config";
import useUserContext from "../contexts/useUserContext";
import profile from "../assets/profile.svg";
import home from "../assets/home.svg";
import IndexedDBService from "../services/IndexedDBService";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function NavBar() {
	const navigate = useNavigate();
	const [user] = useUserContext();

	return (
		<nav className="bg-zomp border-b-4 border-b-black px-2 text-black">
			<ul className="flex">
				<li className="">
					<NavLink to="/">
						<img src={grimpReaper} className="m-2 max-w-8" />
					</NavLink>
				</li>
				<li>
					<img src={info} className="m-2 max-w-8" />
				</li>
				{user ? (
					<li className="my-auto ml-auto">
						<button
							onClick={() => {
								// try catch maybe?
								auth.signOut().catch((e) => console.error(e)); // updates react state
								IndexedDBService.updateCurrentUser("__LOCAL__"); // updates cached user
								navigate("/");
							}}
						>
							SIGN OUT
						</button>
					</li>
				) : null}
			</ul>
		</nav>
	);
}
