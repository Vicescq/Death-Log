import { NavLink } from "react-router";
import grimpReaper from "../assets/grim-reaper.png";
import info from "../assets/info.svg";
import { auth } from "../firebase-config";
import useUserContext from "../contexts/useUserContext";
import profile from "../assets/profile.svg";
import home from "../assets/home.svg";
import IndexedDBService from "../services/IndexedDBService";

export default function NavBar() {
	const [user] = useUserContext();

	return (
		<nav className="bg-zomp border-b-4 border-b-black px-2 text-black">
			<ul className="flex">
				<li className="">
					<img src={grimpReaper} className="m-2 max-w-8" />
				</li>
				<li>
					<NavLink to="/">
						<img src={home} className="m-2 max-w-8" />
					</NavLink>
				</li>
				<li>
					<img src={info} className="m-2 max-w-8" />
				</li>
				{user && user != "__LOCAL__" ? (
					<li className="my-auto ml-auto">
						<button
							onClick={() => {
								auth.signOut().catch((e) => console.error(e));
								IndexedDBService.signOutCurrentUser();
							}}
						>
							SIGN OUT
						</button>
					</li>
				) : null}
				{/* <li className="my-auto ml-auto">
					<img src={profile} alt="" className="max-w-8"/>
				</li> */}
			</ul>
		</nav>
	);
}
