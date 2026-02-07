import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import trash from "../../../assets/trash.svg";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { useState } from "react";
import { CONSTANTS } from "../../../../shared/constants";

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
			<legend className="fieldset-legend">Notes & Delete</legend>
			<label className="floating-label">
				<span>Notes</span>
				<textarea
					className="textarea"
					value={modalState.notes}
					onChange={(e) =>
						onEdit({
							...modalState,
							notes: e.currentTarget.value,
						})
					}
					maxLength={CONSTANTS.TEXTAREA.TEXTAREA_MAX}
					rows={CONSTANTS.TEXTAREA.TEXTAREA_ROWS}
				/>
			</label>

			<label className="floating-label">
				<span>Delete</span>
				<div className="join w-full">
					<input
						type="search"
						className="input join-item"
						placeholder={CONSTANTS.DEATH_LOG_MODAL.DEL_PH}
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
						aria-label={CONSTANTS.DEATH_LOG_MODAL.DEL_SUBMIT}
						disabled={delBtnCSS == "btn-disabled" ? true : false}
					>
						<img className="w-4" src={trash} alt="" />
					</button>
				</div>
			</label>
		</>
	);
}
