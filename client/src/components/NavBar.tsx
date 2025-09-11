import { useNavigate } from "react-router";
import { Link } from "react-router";
import home from "../assets/home.svg";
import utility from "../assets/utility.svg";

export default function NavBar() {
	const navigate = useNavigate();

	return (
		<nav className="bg-zomp border-b-4 border-b-black px-3 text-black">
			<ul className="flex h-12 items-center gap-2">
				<li className="font-bold">
					<Link to="/">
						<img className="w-10" src={home} alt="" />
					</Link>
				</li>
				<li className="font-bold">
					<Link to="/utility">
						<img className="w-10" src={utility} alt="" />
					</Link>
				</li>
				<li className="font-bold">
					<Link to="/info">INFO</Link>
				</li>

			</ul>
		</nav>
	);
}
