import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import DLFABModalBodyAddName from "./DLFABModalBodyAddName";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";
import type { NodeFormAdd } from "../schema";

type Props = {
	type: Exclude<DistinctTreeNode["type"], "ROOT_NODE">;
	form: UseFormReturn<NodeFormAdd, any, NodeFormAdd>;
	onAdd: SubmitHandler<NodeFormAdd>;
};

export default function DLFABModalBodyAdd({ type, form, onAdd }: Props) {
	return (
		<form onSubmit={form.handleSubmit(onAdd)}>
			{type == "subject" ? (
				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
					<legend className="fieldset-legend">
						Subject title & Characteristics
					</legend>

					<DLFABModalBodyAddName form={form} />

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
				</fieldset>
			) : (
				<div className="my-4">
					<DLFABModalBodyAddName form={form} />
				</div>
			)}
		</form>
	);
}
