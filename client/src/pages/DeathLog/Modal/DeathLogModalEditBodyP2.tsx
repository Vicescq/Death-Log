import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import trash from "../../../assets/trash.svg";

export default function DeathLogModalEditBodyP2({
	node,
}: {
	node: DistinctTreeNode;
}) {
	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Notes</legend>
				<textarea
					className="textarea"
					placeholder="Type here"
					value={node.notes}
					onChange={(e) => e.currentTarget.value}
				></textarea>
			</fieldset>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Delete</legend>
				<div className="join">
					<input
						type="text"
						className="input join-item"
						placeholder="Type `DEL` to delete"
					/>
					<button className="btn join-item btn-error p-3">
						<img className="w-4" src={trash} alt="" />
					</button>
				</div>
			</fieldset>
		</>
	);
}
