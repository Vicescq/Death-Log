import { useNavigate } from "react-router";
import home from "../../assets/home.svg";
import save from "../../assets/save.svg";
import dl from "../../assets/death-log.svg";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import NavBarDrawer from "./NavBarDrawer";
import AddItemBtn from "../addItemBtn/AddItemBtn";

export default function NavBar({ isDL }: { isDL: boolean }) {
	const navigate = useNavigate();

	return (
		<div className="navbar bg-base-100">
			<div className="navbar-start">
				<NavBarDrawer />

				<ul className="menu menu-horizontal bg-base-200 rounded-box hidden sm:flex">
					<li>
						<button onClick={() => navigate("/")}>
							<img src={home} alt="" className="h-5 w-5" />
						</button>
					</li>
					<li>
						<button onClick={() => navigate("/log")}>
							<img src={dl} alt="" className="h-5 w-5" />
						</button>
					</li>
					<li>
						<button onClick={() => navigate("/data-management")}>
							<img src={save} alt="" className="h-5 w-5" />
						</button>
					</li>
					<li>
						<button onClick={() => navigate("/x")}>FAQ</button>
					</li>
				</ul>
			</div>

			<div className="navbar-center">{isDL ? <AddItemBtn /> : null}</div>

			<div className="navbar-end">
				<SignedIn>
					<button className="btn btn-square">
						<UserButton />
					</button>
				</SignedIn>
			</div>
		</div>
	);
}
