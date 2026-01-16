import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import trash from "../../../assets/trash.svg";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { useState } from "react";

type Props = {
	node: DistinctTreeNode;
	onEdit: (newModalState: DistinctTreeNode) => void;
};

export default function DLMEBNotesDel({ node, onEdit }: Props) {
	const deleteNode = useDeathLogStore((state) => state.deleteNode);
	const [delBtnCSS, setDelBtnCSS] = useState<"btn-disabled" | "btn-success">(
		"btn-disabled",
	);

	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Notes</legend>
				<textarea
					className="textarea"
					placeholder="Type here"
					value={node.notes}
					onChange={(e) =>
						onEdit({
							...node,
							notes: e.currentTarget.value,
						})
					}
				></textarea>
			</fieldset>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Delete</legend>
				<div className="join">
					<input
						type="search"
						className="input join-item"
						placeholder="Type DEL to delete"
						onChange={(e) => {
							if (e.currentTarget.value == "DEL") {
								setDelBtnCSS("btn-success");
							} else {
								setDelBtnCSS("btn-disabled");
							}
						}}
					/>
					<button
						className={`btn join-item ${delBtnCSS} p-3`}
						onClick={() => deleteNode(node)}
					>
						<img className="w-4" src={trash} alt="" />
					</button>
				</div>
			</fieldset>
		</>
	);
}
