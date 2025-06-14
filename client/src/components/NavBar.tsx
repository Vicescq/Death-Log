import { NavLink } from "react-router";
import grimpReaper from "../assets/grim-reaper.png";
import info from "../assets/info.svg";
import { auth } from "../firebase-config";
import useUserContext from "../contexts/useUserContext";
import profile from "../assets/profile.svg";
import IndexedDBService from "../services/IndexedDBService";

export default function NavBar() {
	const [user] = useUserContext();

	return (
		<nav className="bg-zomp border-b-4 border-b-black px-2 text-black">
			<ul className="flex">
				<li className="m-2">
					<NavLink to="/">
						<img src={grimpReaper} className="max-w-8" />
					</NavLink>
				</li>
				<li className="m-2">
					<NavLink to="/">
						<img src={info} className="max-w-8" />
					</NavLink>
				</li>
				{user ? (
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
