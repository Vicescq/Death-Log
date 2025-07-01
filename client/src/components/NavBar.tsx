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

	async function handleSignOut() {
		try {
			await auth.signOut();

			navigate("/");
		} catch (error) {
			console.error(error);
		}
		// maybe add alertmodal warning that will alert user they will get signed out
	}

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
				<li>
					<NavLink to="/utility">
						<img src="" alt="" />
					</NavLink>
				</li>
				{user && navigator.onLine ? (
					<li className="my-auto ml-auto">
						<button onClick={() => handleSignOut()}>
							SIGN OUT
						</button>
					</li>
				) : null}
			</ul>
		</nav>
	);
}
