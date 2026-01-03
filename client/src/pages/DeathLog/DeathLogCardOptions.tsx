import stepInto from "../../assets/step_into.svg";
import edit from "../../assets/edit.svg";
import { useNavigate } from "react-router";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";

export default function DeathLogCardOptions({
	node,
	handleEdit,
}: {
	node: DistinctTreeNode;
	handleEdit: () => void;
}) {
	let navigate = useNavigate();
	return (
		<ul className="menu menu-horizontal menu-xs rounded-box m-auto p-0">
			<li>
				<button onClick={() => navigate(`${node.id}`)}>
					<img src={stepInto} alt="" className="h-5 w-5" />
				</button>
			</li>
			<li>
				<button onClick={handleEdit}>
					<img src={edit} alt="" className="h-5 w-5" />
				</button>
			</li>
		</ul>
	);
}
