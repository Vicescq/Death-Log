import type { Subject } from "../../../model/TreeNodeModel";

type Props = {
	node: Subject;
};

export default function DLMEBSubject({ node }: Props) {
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
					className="toggle toggle-primary ml-auto"
				/>
			</div>

			<div className="flex">
				<span className="text-[1rem]">Time Spent</span>
				<button className="ml-auto">
					{node.timeSpent == null ? "N / A" : node.timeSpent}
				</button>
				{/* 3h 18m 5s */}
			</div>

			<label className="floating-label mt-4">
				<span>Context</span>
				<select className="select">
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
