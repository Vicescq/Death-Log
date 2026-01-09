import home from "../../assets/home.svg";
import save from "../../assets/save.svg";
import dl from "../../assets/death-log.svg";
import navPanel from "../../assets/nav_panel.svg";
import { Link } from "react-router";
import { useActiveNavBarCSS } from "./useActiveNavBarCSS";
import { SignedIn, UserButton } from "@clerk/clerk-react";

export default function NavBarDrawer() {
	const { activeDLCSS, activeDMCSS, activeFAQCSS } =
		useActiveNavBarCSS("btn");

	// z index of 1000 due to death log FAB has a z index of 999
	return (
		<div className="drawer z-[1000] md:hidden">
			<input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content">
				<label htmlFor="my-drawer-1" className="btn drawer-button">
					<img src={navPanel} alt="" className="h-5 w-5" />
				</label>
			</div>
			<div className="drawer-side">
				<label
					htmlFor="my-drawer-1"
					aria-label="close sidebar"
					className="drawer-overlay"
				></label>
				<ul className="menu bg-base-100 min-h-full w-48 gap-2 p-4">
					<li>
						<Link className="btn" to={{ pathname: "/" }}>
							<img src={home} alt="" className="h-5 w-5" />
						</Link>
					</li>
					<div className="divider divider-neutral m-0"></div>
					<li>
						<Link
							className={`btn ${activeDLCSS}`}
							to={{ pathname: "/log" }}
						>
							<img src={dl} alt="" className="h-5 w-5" />
						</Link>
					</li>
					<li>
						<Link
							className={`btn ${activeDMCSS}`}
							to={{ pathname: "/data-management" }}
						>
							<img src={save} alt="" className="h-5 w-5" />
						</Link>
					</li>
					<li>
						<Link
							className={`btn ${activeFAQCSS}`}
							to={{ pathname: "/FAQ" }}
						>
							FAQ
						</Link>
					</li>
					<SignedIn>
						<li>
							<button className="btn">
								<UserButton />
							</button>
						</li>
					</SignedIn>
				</ul>
			</div>
		</div>
	);
}
