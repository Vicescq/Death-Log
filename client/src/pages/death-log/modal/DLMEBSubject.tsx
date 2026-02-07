import type { DistinctTreeNode, Subject } from "../../../model/TreeNodeModel";
import * as Utils from "../utils";

type Props = {
	modalState: Subject;
	onEdit: (newModalState: DistinctTreeNode) => void;
};

export default function DLMEBSubject({ modalState, onEdit }: Props) {
	return (
		<>
			<legend className="fieldset-legend">Subject Characteristics</legend>

			<div className="flex">
				<label htmlFor="reoccurring-toggle" className="text-[1rem]">
					Reoccurring
				</label>
				<input
					id="reoccurring-toggle"
					type="checkbox"
					checked={modalState.reoccurring}
					className="toggle toggle-primary ml-auto"
					onChange={() => {
						const newChange = !modalState.reoccurring;
						if (newChange) {
							onEdit({
								...modalState,
								reoccurring: newChange,
								dateEnd: null,
								completed: false,
							});
						} else {
							onEdit({
								...modalState,
								reoccurring: newChange,
							});
						}
					}}
				/>
			</div>

			<div className="flex">
				<span className="text-[1rem]">Time Spent</span>
				<button className="ml-auto">
					{modalState.timeSpent == null
						? "N / A"
						: modalState.timeSpent}
				</button>
				{/* 3h 18m 5s */}
			</div>

			<label className="floating-label mt-4" >
				<span>Context</span>
				<select
					className="select"
					value={Utils.mapContextKeyToProperStr(modalState.context)}
					onChange={(e) =>
						onEdit({
							...modalState,
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
			</label>
		</>
	);
}
