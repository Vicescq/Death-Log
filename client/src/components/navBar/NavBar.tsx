import { Link } from "react-router";
import home from "../../assets/home.svg";
import save from "../../assets/save.svg";
import dl from "../../assets/death-log.svg";
import faq from "../../assets/faq.svg";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import NavBarDrawer from "./NavBarDrawer";
import { useActiveNavBarCSS } from "./useActiveNavBarCSS";

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
	const { activeDLCSS, activeDMCSS, activeFAQCSS } = useActiveNavBarCSS("bg");
	return (
		<div className="navbar bg-base-100 sticky top-0 z-10">
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
							className={activeDMCSS}
							to={{ pathname: "/data-management" }}
						>
							<img src={save} alt="" className="h-5 w-5" />
						</Link>
					</li>
					<li>
						<Link
							className={activeFAQCSS}
							to={{ pathname: "/FAQ" }}
						>
							<img src={faq} alt="" className="h-5 w-5" />
						</Link>
					</li>
					<SignedIn>
						<li>
							<button>
								<UserButton />
							</button>
						</li>
					</SignedIn>
				</ul>
			</div>

			<div className="navbar-center">{midNavContent}</div>

			<div className={`navbar-end ${endNavContentCSS}`}>
				{endNavContent}
			</div>
		</div>
	);
}
