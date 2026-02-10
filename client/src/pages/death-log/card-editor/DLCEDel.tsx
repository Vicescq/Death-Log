import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import trash from "../../../assets/trash.svg";
import { CONSTANTS } from "../../../../shared/constants";

type Props = {
	node: DistinctTreeNode;
	delStr: string;
	onDelete: (node: DistinctTreeNode) => void;
	onDelStrChange: (inputString: string) => void;
};

export default function DLCEDel({
	node,
	onDelete,
	delStr,
	onDelStrChange,
}: Props) {
	return (
		<label className="floating-label">
			<span>Delete</span>
			<div className="join w-full">
				<input
					type="search"
					className="input join-item w-full"
					placeholder={CONSTANTS.DEATH_LOG_MODAL.DEL_PH}
					onChange={(e) => onDelStrChange(e.currentTarget.value)}
					value={delStr}
				/>
				<button
					className={`btn join-item btn-success p-3`}
					onClick={(e) => {
						e.preventDefault();
						onDelete(node);
					}}
					aria-label={CONSTANTS.DEATH_LOG_MODAL.DEL_SUBMIT}
					disabled={delStr != "DEL"}
				>
					<img className="w-4" src={trash} alt="" />
				</button>
			</div>
		</label>
	);
}
