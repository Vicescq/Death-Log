import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import trash from "../../../assets/trash.svg";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { useEffect, useState } from "react";

type Props = {
	node: DistinctTreeNode;
	handleOnEditChange: (newModalState: DistinctTreeNode) => void;
};

export default function DeathLogModalEditBodyPage2({
	node,
	handleOnEditChange,
}: Props) {
	const deleteGame = useDeathLogStore((state) => state.deleteGame);
	const deleteProfile = useDeathLogStore((state) => state.deleteProfile);
	const deleteSubject = useDeathLogStore((state) => state.deleteSubject);

	const [delConfirmStr, setDelConfirmStr] = useState("");
	const [delBtnCSS, setDelBtnCSS] = useState("btn-accent");

	useEffect(() => {
		if (delConfirmStr == "DEL") {
			setDelBtnCSS("btn-success");
		} else {
			setDelBtnCSS("btn-accent");
		}
	}, [delConfirmStr]);

	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Notes</legend>
				<textarea
					className="textarea"
					placeholder="Type here"
					value={node.notes}
					onChange={(e) =>
						handleOnEditChange({
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
						placeholder="Type `DEL` to delete"
						value={delConfirmStr}
						onChange={(e) =>
							setDelConfirmStr(e.currentTarget.value)
						}
					/>
					<button
						className={`btn join-item ${delBtnCSS} p-3`}
						onClick={() => {
							if (delConfirmStr == "DEL") {
								switch (node.type) {
									case "game":
										deleteGame(node);
										break;
									case "profile":
										deleteProfile(node);
										break;
									default:
										deleteSubject(node);
								}
							} else {
							}
						}}
					>
						<img className="w-4" src={trash} alt="" />
					</button>
				</div>
			</fieldset>
		</>
	);
}
