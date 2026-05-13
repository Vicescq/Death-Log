import type { UseFormReturn, SubmitHandler } from "react-hook-form";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";
import type { NodeFormAdd } from "../formSchemas";
import { CONSTANTS } from "../../../../shared/constants";
import type { ReactNode } from "react";

type Props = {
	type: Exclude<DistinctTreeNode["type"], "ROOT_NODE">;
	form: UseFormReturn<NodeFormAdd, any, NodeFormAdd>;
	onAdd: SubmitHandler<NodeFormAdd>;
};

export default function ToolbarAdd({ type, form, onAdd }: Props) {
	const addBody: ReactNode = (
		<>
			<label className="floating-label">
				<span>Name</span>
				<div className="join w-full">
					<input
						type="search"
						className="input join-item"
						{...form.register("name")}
					/>
					<button
						type="submit"
						className="btn join-item btn-success"
						disabled={!form.formState.isValid}
					>
						{CONSTANTS.DEATH_LOG_FAB.ADD_SUBMIT}
					</button>
				</div>
			</label>

			{form.formState.errors.name && (
				<div className="text-error">
					{form.formState.errors.name.message}
				</div>
			)}
		</>
	);

	return (
		<form onSubmit={form.handleSubmit(onAdd)}>
			{type == "subject" ? (
				<div className="my-4 flex flex-col gap-2">
					{addBody}

					<label className="floating-label mt-4">
						<span>Context</span>
						<select
							className="select w-full"
							{...form.register("context")}
						>
							<option>Boss</option>
							<option>Location</option>
							<option>Generic Enemy</option>
							<option>Mini Boss</option>
							<option>Other</option>
						</select>
					</label>

					<div className="my-2 flex">
						<span className="text-[1rem]">Reoccurring</span>
						<input
							type="checkbox"
							className="toggle toggle-primary ml-auto"
							{...form.register("reoccurring")}
						/>
					</div>
				</div>
			) : (
				<div className="my-4">{addBody}</div>
			)}
		</form>
	);
}
