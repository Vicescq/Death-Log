import home from "../../assets/home.svg";
import save from "../../assets/save.svg";
import dl from "../../assets/death-log.svg";
import navPanel from "../../assets/nav_panel.svg";
import faq from "../../assets/faq.svg";
import about from "../../assets/about.svg";
import graph from "../../assets/graph.svg";
import { Link } from "react-router";
import { useActiveNavBarCSS } from "./useActiveNavBarCSS";
import ProfileButton from "./ProfileButton";
import { Z_INDICES } from "../../../shared/z-indices";

export default function NavBarDrawer() {
	const {
		activeDLCSS,
		activeStatsCSS,
		activeDMCSS,
		activeFAQCSS,
		activeAboutCSS,
		activeUserSettingsCSS,
	} = useActiveNavBarCSS("btn");

	return (
		<div className={`drawer lg:hidden ${Z_INDICES.NAV_DRAWER}`}>
			<input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content">
				<label
					htmlFor="my-drawer-1"
					className="btn btn-ghost drawer-button"
				>
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
							className={`btn ${activeStatsCSS}`}
							to={{ pathname: "/stats" }}
						>
							<img src={graph} alt="" className="h-5 w-5" />
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
							to={{ pathname: "/faq" }}
						>
							<img src={faq} alt="" className="h-5 w-5" />
						</Link>
					</li>
					<li>
						<Link
							className={`btn ${activeAboutCSS}`}
							to={{ pathname: "/about" }}
						>
							<img src={about} alt="" className="h-5 w-5" />
						</Link>
					</li>
					<li>
						<ProfileButton
							className={`btn ${activeUserSettingsCSS}`}
						/>
					</li>
				</ul>
			</div>
		</div>
	);
}
