import { useEffect, useState } from "react";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import * as Utils from "../utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";

type Props = {
	node: DistinctTreeNode;
	handleOnEditChange: (newModalState: DistinctTreeNode) => void;
};

export default function DeathLogModalEditBodyNameDate({
	node,
	handleOnEditChange,
}: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const [inputTextError, setInputTextError] = useState("");

	useEffect(() => {
		if(node.name == ""){
			setInputTextError("Name cannot be empty!")
		}
		else{
			setInputTextError("")
		}
	}, [node.name])

	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Name</legend>

				<input
					type="search"
					className="input"
					value={node.name}
					onChange={(e) => {
						try {
							if (e.currentTarget.value != ""){
								Utils.validateNodeString(
									e.currentTarget.value,
									tree,
									node.parentID,
								);
							}
							handleOnEditChange({
								...node,
								name: e.currentTarget.value,
							});
						} catch (e) {
							if (e instanceof Error) {
								setInputTextError(e.message);
							}
						}
					}}
					onBlur={(e) =>
						handleOnEditChange({
							...node,
							name: e.currentTarget.value
								.replace(/\s+/g, " ")
								.trim(),
						})
					}
				/>
				<div
					className={`text-error mt-2 ml-2 ${inputTextError != "" ? "" : "hidden"} text-sm`}
				>
					{inputTextError}
				</div>
			</fieldset>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">
					{node.completed
						? "Creation (1st) & Completion (2nd) Dates"
						: "Creation Date"}
				</legend>

				<input
					type="date"
					className="input join-item"
					value={Utils.defaultCardModalDateFormat(node.dateStart)}
					onChange={(e) =>
						handleOnEditChange({
							...node,
							dateStart:
								e.currentTarget.value == ""
									? node.dateStart
									: Utils.convertDefaultCardModalDateFormatToISO(
											e.currentTarget.value,
										),
						})
					}
					max={
						node.completed && node.dateEnd
							? Utils.defaultCardModalDateFormat(node.dateEnd)
							: Utils.defaultCardModalDateFormat(
									new Date().toISOString(),
								)
					}
				/>

				{node.completed ? (
					<input
						type="date"
						className="input join-item"
						value={
							node.dateEnd
								? Utils.defaultCardModalDateFormat(node.dateEnd)
								: undefined
						}
						onChange={(e) =>
							handleOnEditChange({
								...node,
								dateEnd:
									e.currentTarget.value == ""
										? node.dateEnd
										: Utils.convertDefaultCardModalDateFormatToISO(
												e.currentTarget.value,
											),
							})
						}
						min={Utils.defaultCardModalDateFormat(node.dateStart)}
					/>
				) : null}
				<div className="divider my-2">↓ Reliability Flags ↓</div>
				<div className="flex">
					<span className="text-[1rem]">Creation Date</span>
					<input
						type="checkbox"
						checked={node.dateStartRel}
						className="toggle toggle-primary ml-auto"
						onChange={(e) =>
							handleOnEditChange({
								...node,
								dateStartRel: e.currentTarget.checked,
							})
						}
					/>
				</div>
				{node.completed ? (
					<div className="flex">
						<span className="text-[1rem]">Completion Date</span>
						<input
							type="checkbox"
							checked={node.dateEndRel}
							className="toggle toggle-primary ml-auto"
							onChange={(e) =>
								handleOnEditChange({
									...node,
									dateEndRel: e.currentTarget.checked,
								})
							}
						/>
					</div>
				) : null}
			</fieldset>
		</>
	);
}
