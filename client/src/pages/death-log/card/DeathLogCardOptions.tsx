import stepInto from "../../../assets/step_into.svg";
import edit from "../../../assets/edit.svg";
import group from "../../../assets/group.svg";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { Link } from "react-router";
import { CONSTANTS } from "../../../../shared/constants";

export default function DeathLogCardOptions({
	node,
	openModal,
}: {
	node: DistinctTreeNode;
	openModal: () => void;
}) {
	return (
		<ul className="menu menu-horizontal menu-xs rounded-box m-auto p-0">
			<Link to={{ pathname: node.id }}>
				<li>
					<button
						aria-label={CONSTANTS.DEATH_LOG_CARD.ENTRY_CHILDREN}
					>
						<img src={stepInto} alt="" className="h-4 w-4" />
					</button>
				</li>
			</Link>
			<li>
				<button
					onClick={openModal}
					aria-label={CONSTANTS.DEATH_LOG_CARD.EDIT_MODAL}
				>
					<img src={edit} alt="" className="h-4 w-4" />
				</button>
			</li>
			{node.type == "profile" ? (
				<Link to={{ pathname: `${node.id}/profile-group-edit` }}>
					<li>
						<button aria-label="Edit Profile Group Button">
							<img src={group} alt="" className="h-4 w-4" />
						</button>
					</li>
				</Link>
			) : null}
		</ul>
	);
}
