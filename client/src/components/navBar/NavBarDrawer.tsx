import home from "../../assets/home.svg";
import save from "../../assets/save.svg";
import dl from "../../assets/death-log.svg";
import navPanel from "../../assets/nav_panel.svg";
import { useNavigate } from "react-router";

export default function NavBarDrawer() {
	const navigate = useNavigate();
	return (
		<div className="drawer sm:hidden">
			<input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content">
				<label htmlFor="my-drawer-1" className="btn drawer-button">
					<img src={navPanel} alt="" className="h-5 w-5"/>
				</label>
			</div>
			<div className="drawer-side">
				<label
					htmlFor="my-drawer-1"
					aria-label="close sidebar"
					className="drawer-overlay"
				></label>
				<ul className="menu bg-base-100 min-h-full w-48 p-4">
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
						<button>
							<img
								src={save}
								alt=""
								className="h-5 w-5"
								onClick={() => navigate("/data-management")}
							/>
						</button>
					</li>
					<li>
						<button onClick={() => navigate("/x")}>FAQ</button>
					</li>
				</ul>
			</div>
		</div>
	);
}
