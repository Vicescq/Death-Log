import { NavLink } from "react-router";
import grimpReaper from "../assets/grim-reaper.png";
import info from "../assets/info.svg";

export default function NavBar() {
	
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
			</ul>
		</nav>
	);
}