import { useNavigate } from "react-router";
import home from "../../assets/home.svg";
import save from "../../assets/save.svg";
import dl from "../../assets/death-log.svg";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import NavBarDrawer from "./NavBarDrawer";
import { useActiveNavBarCSS } from "./useActiveNavBarCSS";
import usePagination from "../../hooks/usePagination";

export default function NavBar() {
	const navigate = useNavigate();
	const { activeDLCSS, activeDMCSS, activeFAQCSS } = useActiveNavBarCSS("bg");
	// const { page, handlePageState, handlePageTurn } = usePagination(5);
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

					<div className="divider divider-horizontal divider-neutral m-0"></div>

					<li>
						<button
							onClick={() => navigate("/log")}
							className={activeDLCSS}
						>
							<img src={dl} alt="" className="h-5 w-5" />
						</button>
					</li>
					<li>
						<button
							onClick={() => navigate("/data-management")}
							className={activeDMCSS}
						>
							<img src={save} alt="" className="h-5 w-5" />
						</button>
					</li>
					<li>
						<button
							onClick={() => navigate("/FAQ")}
							className={activeFAQCSS}
						>
							FAQ
						</button>
					</li>
					{/* <li>
						<button
							onClick={() => navigate("/x")}
						>
							TEST
						</button>
					</li> */}
				</ul>
			</div>

			<div className="navbar-center">
				<div className="join flex">
					<button
						className="join-item btn"
						onClick={() => {
							1;
						}}
					>
						«
					</button>
					<button className="join-item btn flex-1">Page 1</button>
					<button
						className="join-item btn"
						onClick={() => {
							1;
						}}
					>
						»
					</button>
				</div>
			</div>

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
