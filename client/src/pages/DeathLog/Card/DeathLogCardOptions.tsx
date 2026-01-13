import stepInto from "../../../assets/step_into.svg";
import edit from "../../../assets/edit.svg";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { Link } from "react-router";

export default function DeathLogCardOptions({
	node,
	handleEdit,
}: {
	node: DistinctTreeNode;
	handleEdit: () => void;
}) {
	return (
		<ul className="menu menu-horizontal menu-xs rounded-box m-auto p-0">
			<Link to={{ pathname: node.id }}>
				<li>
					<button aria-label="Folder Button">
						<img src={stepInto} alt="" className="h-5 w-5" />
					</button>
				</li>
			</Link>
			<li>
				<button onClick={handleEdit} aria-label="Edit Button">
					<img src={edit} alt="" className="h-5 w-5" />
				</button>
			</li>
		</ul>
	);
}
