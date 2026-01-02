import home from "../../assets/home.svg";
import save from "../../assets/save.svg";
import dl from "../../assets/death-log.svg";
import navPanel from "../../assets/nav_panel.svg";
import { useNavigate } from "react-router";
import { useActiveNavBarCSS } from "./useActiveNavBarCSS";

export default function NavBarDrawer() {
	const navigate = useNavigate();
	const { activeDLCSS, activeDMCSS, activeFAQCSS } = useActiveNavBarCSS("btn");

	// z index of 1000 due to death log FAB has a z index of 999
	return (
		<div className="drawer z-[1000] sm:hidden">
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
				<ul className="menu bg-base-100 min-h-full w-48 p-4 gap-2">
					<li onClick={() => navigate("/")}>
						<button className="btn">
							<img src={home} alt="" className="h-5 w-5" />
						</button>
					</li>
					<div className="divider divider-neutral m-0"></div>
					<li onClick={() => navigate("/log")}>
						<button className={`btn ${activeDLCSS}`}>
							<img src={dl} alt="" className="h-5 w-5" />
						</button>
					</li>
					<li onClick={() => navigate("/data-management")}>
						<button className={`btn ${activeDMCSS}`}>
							<img src={save} alt="" className="h-5 w-5" />
						</button>
					</li>
					<li>
						<button className={`btn ${activeFAQCSS}`} onClick={() => navigate("/FAQ")}>
							FAQ
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
}
