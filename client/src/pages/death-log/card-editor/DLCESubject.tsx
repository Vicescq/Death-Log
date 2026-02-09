import type { UseFormReturn } from "react-hook-form";
import type { Subject } from "../../../model/TreeNodeModel";
import type { NodeForm } from "./DeathLogCardEditor";

type Props = {
	node: Subject;
	form: UseFormReturn<NodeForm, any, NodeForm>;
};

export default function DLCESubject({ node, form }: Props) {
	return (
		<>
			<div className="flex">
				<label htmlFor="reoccurring-toggle" className="text-[1rem]">
					Reoccurring
				</label>
				<input
					id="reoccurring-toggle"
					type="checkbox"
					className="toggle toggle-primary my-auto ml-auto"
					{...form.register("reoccurring")}
				/>
			</div>
			<div className="flex">
				<span className="text-[1rem]">Time Spent</span>
				<span className="my-auto ml-auto">
					{node.timeSpent == null ? "N / A" : node.timeSpent}
				</span>
				{/* 3h 18m 5s */}
			</div>
			<label className="floating-label">
				<span>Context</span>
				<select className="select w-full" {...form.register("context")}>
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
