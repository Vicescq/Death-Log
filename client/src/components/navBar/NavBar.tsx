import { useNavigate } from "react-router";
import home from "../../assets/home.svg";
import save from "../../assets/save.svg";
import dl from "../../assets/death-log.svg";
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
	const navigate = useNavigate();
	const { activeDLCSS, activeDMCSS, activeFAQCSS } = useActiveNavBarCSS("bg");
	// const { page, handlePageState, handlePageTurn } = usePagination(5);
	return (
		<div className="navbar bg-base-100">
			<div className={`navbar-start ${startNavContentCSS}`}>
				<NavBarDrawer />

				<ul className="menu menu-horizontal bg-base-200 rounded-box hidden items-center justify-center md:flex">
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
					<li>
						<SignedIn>
							<button>
								<UserButton />
							</button>
						</SignedIn>
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

			<div className="navbar-center">{midNavContent}</div>

			<div className={`navbar-end ${endNavContentCSS}`}>
				{endNavContent}
			</div>
		</div>
	);
}
