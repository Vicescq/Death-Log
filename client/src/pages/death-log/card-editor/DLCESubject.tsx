import type { UseFormReturn } from "react-hook-form";
import type { NodeFormEdit } from "../formSchemas";
import type { Subject } from "../../../model/tree-node-model/SubjectSchema";
import { CONSTANTS } from "../../../../shared/constants";

type Props = {
	node: Subject;
	form: UseFormReturn<NodeFormEdit, any, NodeFormEdit>;
};

export default function DLCESubject({ node, form }: Props) {
	return (
		<div className="flex flex-col gap-4">
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

			<label className="floating-label">
				<span>Time Spent</span>
				<input
					type="text"
					className={`input ${form.formState.dirtyFields.timeSpent ? "input-primary" : ""} w-full`}
					{...form.register("timeSpent")}
				/>
				{form.formState.errors.timeSpent && (
					<div className="text-error">
						{form.formState.errors.timeSpent.message}
					</div>
				)}
			</label>
			<div>{CONSTANTS.INFO.TIMESPENT}</div>

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
		</div>
	);
}
