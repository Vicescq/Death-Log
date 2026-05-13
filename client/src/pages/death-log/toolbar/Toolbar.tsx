import add from "../../../assets/add.svg";
import filter from "../../../assets/filter.svg";
import sort from "../../../assets/sort.svg";
import search from "../../../assets/search.svg";

export default function Toolbar() {
	return (
		<div className="fixed bottom-4 left-1/2 z-5 w-max -translate-x-1/2">
			<ul className="menu menu-xs menu-horizontal bg-neutral rounded-box">
				<li>
					<button className="btn btn-neutral">
						<img src={add} alt="" />
					</button>
				</li>
				<div className="divider divider-horizontal mx-0.5"></div>
				<li>
					<button className="btn btn-neutral">
						<img src={search} alt="" />
					</button>
				</li>
				<li>
					<button className="btn btn-neutral">
						<img src={filter} alt="" />
					</button>
				</li>
				<li>
					<button className="btn btn-neutral">
						<img src={sort} alt="" />
					</button>
				</li>
			</ul>
		</div>
	);
}
