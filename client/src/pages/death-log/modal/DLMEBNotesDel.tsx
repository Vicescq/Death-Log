import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import trash from "../../../assets/trash.svg";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { useState } from "react";
import { CONSTANTS } from "../../../../shared/constants";

type Props = {
	node: DistinctTreeNode;
};

export default function DLMEBNotesDel({ node }: Props) {
	const deleteNode = useDeathLogStore((state) => state.deleteNode);
	const [delBtnCSS, setDelBtnCSS] = useState<"btn-disabled" | "btn-success">(
		"btn-disabled",
	);

	return (
		<>
			<legend className="fieldset-legend">Notes & Delete</legend>
			<label className="floating-label">
				<span>Notes</span>
				<textarea className="textarea" />
			</label>

			<label className="floating-label">
				<span>Delete</span>
				<div className="join w-full">
					<input
						type="search"
						className="input join-item"
						placeholder={CONSTANTS.DEATH_LOG_MODAL.DEL_PH}
					/>
					<button
						className={`btn join-item ${delBtnCSS} p-3`}
						onClick={() => deleteNode(node)}
						aria-label={CONSTANTS.DEATH_LOG_MODAL.DEL_SUBMIT}
						// disabled={delBtnCSS == "btn-disabled" ? true : false}
					>
						<img className="w-4" src={trash} alt="" />
					</button>
				</div>
			</label>
		</>
	);
}
