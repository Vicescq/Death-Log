import type { UseFormReturn } from "react-hook-form";
import type { NodeFormEdit } from "../EditorAndFABschema";
import type { Subject } from "../../../model/tree-node-model/SubjectSchema";

type Props = {
	node: Subject;
	form: UseFormReturn<NodeFormEdit, any, NodeFormEdit>;
};

export default function DLCESubject({ node, form }: Props) {
	return (
		<div className="flex flex-col gap-2">
			<div>
				<label className="floating-label">
					<span>Context</span>
					<select
						className={`select ${form.formState.dirtyFields.context ? "select-success" : ""} w-full`}
						{...form.register("context")}
					>
						<option>Boss</option>
						<option>Location</option>
						<option>Generic Enemy</option>
						<option>Mini Boss</option>
						<option>Other</option>
					</select>
				</label>
			</div>
			<div className="flex">
				<label
					htmlFor="reoccurring-toggle"
					className={`${form.formState.dirtyFields.reoccurring ? "text-success" : ""} text-[1rem]`}
				>
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
		</div>
	);
}
