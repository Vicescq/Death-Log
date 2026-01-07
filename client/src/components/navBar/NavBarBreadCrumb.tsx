import stepInto from "../../assets/step_into.svg";
import deathLog from "../../assets/death-log.svg";

export default function NavBarBreadCrumb() {
	return (
		<div className="breadcrumbs text-sm max-w-xs">
			<ul>
				<li>
					<a>
						<img src={deathLog} alt="" className="w-4"/>
						Home
					</a>
				</li>

                
			</ul>
		</div>
	);
}
