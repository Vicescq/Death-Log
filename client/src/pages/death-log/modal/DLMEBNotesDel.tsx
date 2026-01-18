import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import trash from "../../../assets/trash.svg";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { useState } from "react";

type Props = {
	modalState: DistinctTreeNode;
	onEdit: (newModalState: DistinctTreeNode) => void;
};

export default function DLMEBNotesDel({ modalState, onEdit }: Props) {
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
					value={modalState.notes}
					onChange={(e) =>
						onEdit({
							...modalState,
							notes: e.currentTarget.value,
						})
					}
					maxLength={1000}
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
						onClick={() => deleteNode(modalState)}
						aria-label="Delete Entry"
						disabled={delBtnCSS == "btn-disabled" ? true : false}
					>
						<img className="w-4" src={trash} alt="" />
					</button>
				</div>
			</fieldset>
		</>
	);
}
