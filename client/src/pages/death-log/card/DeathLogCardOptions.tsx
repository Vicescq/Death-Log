import stepInto from "../../../assets/step_into.svg";
import edit from "../../../assets/edit.svg";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { Link } from "react-router";
import { CONSTANTS } from "../../../../shared/constants";

type Props = {
	node: DistinctTreeNode;
};

export default function DeathLogCardOptions({ node }: Props) {
	return (
		<ul className="menu menu-horizontal menu-xs rounded-box m-auto p-0">
			<Link to={{ pathname: node.id }}>
				<li>
					<button
						aria-label={CONSTANTS.DEATH_LOG_CARD.ENTRY_CHILDREN_ARIA}
					>
						<img src={stepInto} alt="" className="h-4 w-4" />
					</button>
				</li>
			</Link>
			<li>
				<Link to={{ pathname: `${node.id}/edit` }}>
					<button
						className="cursor-pointer"
						aria-label={CONSTANTS.DEATH_LOG_CARD.EDIT_MODE_ARIA}
					>
						<img src={edit} alt="" className="h-4 w-4" />
					</button>
				</Link>
			</li>
		</ul>
	);
}
