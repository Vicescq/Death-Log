import { useState } from "react";
import type {
	DistinctTreeNode,
	Subject,
} from "../../../model/TreeNodeModel";
import * as Utils from "../utils";

type Props = {
	node: Subject;
	handleOnEditChange: (newModalState: DistinctTreeNode) => void;
};

export default function DeathLogModalEditBodySubject({
	node,
	handleOnEditChange,
}: Props) {
	const [profileGroupText, setProfileGroupText] = useState("");

	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">
					Subject Characteristics
				</legend>

				<div className="flex">
					<span className="text-[1rem]">Reoccurring</span>
					<input
						type="checkbox"
						checked={node.reoccurring}
						className="toggle toggle-primary ml-auto"
						onChange={() => {
							const newChange = !node.reoccurring;
							if (newChange) {
								handleOnEditChange({
									...node,
									reoccurring: newChange,
									dateEnd: null,
									completed: false,
								});
							} else {
								handleOnEditChange({
									...node,
									reoccurring: newChange,
								});
							}
						}}
					/>
				</div>

				<div className="flex">
					<span className="text-[1rem]">Time Spent</span>
					<button className="ml-auto">
						{node.timeSpent == null ? "N / A" : node.timeSpent}
					</button>
					{/* 3h 18m 5s */}
				</div>

				<div className="divider mt-1 mb-0"></div>
				<fieldset className="fieldset">
					<legend className="fieldset-legend">Context</legend>
					<select
						className="select"
						value={Utils.mapContextKeyToProperStr(node.context)}
						onChange={(e) =>
							handleOnEditChange({
								...node,
								context: Utils.mapProperStrToContextKey(
									e.currentTarget.value,
								),
							})
						}
					>
						<option>Boss</option>
						<option>Location</option>
						<option>Generic Enemy</option>
						<option>Mini Boss</option>
						<option>Other</option>
					</select>
				</fieldset>
			</fieldset>
			{/* <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Profile Groups</legend>

				<div className="join">
					<input
						className="input join-item"
						placeholder="New Profile Group"
						value={profileGroupText}
						onChange={(e) =>
							setProfileGroupText(e.currentTarget.value)
						}
					/>
					<button
						className="btn btn-accent join-item rounded-r-full"
						onClick={() => {
							handleOnEditChangeParent({
								...parentNode,
								groupings: [
									...parentNode.groupings,
									{
										title: profileGroupText,
										description: "",
										members: [],
									},
								],
							});
						}}
					>
						+
					</button>
				</div>

				<div className="divider m-1">↓ Active Profile Groups ↓</div>

				<ul className="flex max-h-24 flex-col gap-2 overflow-auto">
					{parentNode.groupings.map((prfoileGroup, i) => {
						return (
							<li key={i}>
								<label className="label">
									<input
										type="checkbox"
										className="checkbox checkbox-sm checkbox-secondary"
									/>
									<span className="ml-2">{prfoileGroup.title}</span>
								</label>
							</li>
						);
					})}
				</ul>
			</fieldset> */}
		</>
	);
}
