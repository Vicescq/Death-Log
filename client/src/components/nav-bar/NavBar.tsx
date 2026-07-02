import { Link } from "react-router";
import home from "../../assets/home.svg";
import save from "../../assets/save.svg";
import dl from "../../assets/death-log.svg";
import faq from "../../assets/faq.svg";
import about from "../../assets/about.svg";
import graph from "../../assets/graph.svg";
import NavBarDrawer from "./NavBarDrawer";
import ProfileButton from "./ProfileButton";
import { useActiveNavBarCSS } from "./useActiveNavBarCSS";
import { Z_INDICES } from "../../../shared/z-indices";

type Props = {
	midNavContent?: React.JSX.Element;
	endNavContent?: React.JSX.Element;
	endNavContentCSS?: string;
	startNavContentCSS?: string;
};

export default function NavBar({
	midNavContent,
	endNavContent,
	endNavContentCSS,
	startNavContentCSS,
}: Props) {
	const {
		activeDLCSS,
		activeStatsCSS,
		activeDMCSS,
		activeFAQCSS,
		activeAboutCSS,
		activeUserSettingsCSS,
	} = useActiveNavBarCSS("bg");
	return (
		<div
			className={`navbar bg-base-100 sticky top-0 ${Z_INDICES.STICKY_NAVBAR}`}
		>
			<div className={`navbar-start ${startNavContentCSS}`}>
				<NavBarDrawer />

				<ul className="menu menu-horizontal rounded-box hidden items-center justify-center gap-0.5 lg:flex">
					<li>
						<Link to={{ pathname: "/" }}>
							<img src={home} alt="" className="h-5 w-5" />
						</Link>
					</li>

					<div className="divider divider-horizontal divider-neutral m-0"></div>

					<li>
						<Link className={activeDLCSS} to={{ pathname: "/log" }}>
							<img src={dl} alt="" className="h-5 w-5" />
						</Link>
					</li>

					<li>
						<Link
							className={activeStatsCSS}
							to={{ pathname: "/stats" }}
						>
							<img src={graph} alt="" className="h-5 w-5" />
						</Link>
					</li>

					<li>
						<Link
							className={activeDMCSS}
							to={{ pathname: "/data-management" }}
						>
							<img src={save} alt="" className="h-5 w-5" />
						</Link>
					</li>

					<li>
						<Link
							className={activeFAQCSS}
							to={{ pathname: "/faq" }}
						>
							<img src={faq} alt="" className="h-5 w-5" />
						</Link>
					</li>

					<li>
						<Link
							className={activeAboutCSS}
							to={{ pathname: "/about" }}
						>
							<img src={about} alt="" className="h-5 w-5" />
						</Link>
					</li>

					<li>
						<ProfileButton className={activeUserSettingsCSS} />
					</li>
				</ul>
			</div>

			<div className="navbar-center">{midNavContent}</div>

			<div className={`navbar-end ${endNavContentCSS}`}>
				{endNavContent}
			</div>
		</div>
	);
}
