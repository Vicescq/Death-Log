import { useNavigate } from "react-router";
import { Link } from "react-router";
import home from "../assets/home.svg";
import save from "../assets/save.svg";
import dl from "../assets/death-log.svg";
import { SignedIn, UserButton } from "@clerk/clerk-react";

export default function NavBar() {
	const navigate = useNavigate();

	return (
		<div className="navbar bg-base-100 shadow-lg">
			<div className="flex-none">
				<button className="btn btn-square btn-ghost">
					<img src={home} alt="" className="h-8 w-8" />
				</button>
			</div>
			<div className="flex-1">
				<button className="btn btn-square btn-ghost">
					<img src={dl} alt="" className="h-8 w-8" />
				</button>
				<button className="btn btn-square btn-ghost">
					<img src={save} alt="" className="h-8 w-8" />
				</button>
				<a className="btn btn-ghost text-xl">FAQ</a>
			</div>
			<div className="flex-none">
				<SignedIn>
					<button className="btn btn-square btn-ghost">
						<UserButton />
					</button>
				</SignedIn>
			</div>
		</div>
	);
}
