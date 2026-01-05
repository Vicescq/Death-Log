import type { DistinctTreeNode, Subject } from "../../../model/TreeNodeModel";
import * as Utils from "../utils";

type Props = {
	node: Subject;
	handleOnEditChange: (newModalState: DistinctTreeNode) => void;
};

export default function DeathLogModalEditBodyPage3({
	node,
	handleOnEditChange,
}: Props) {
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
					<button className="ml-auto">N / A</button>
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
		</>
	);
}
