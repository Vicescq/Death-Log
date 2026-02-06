import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { AddForm } from "./DeathLogFAB";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DLFABModalBodyAddName from "./DLFABModalBodyAddName";

type Props = {
	type: Exclude<DistinctTreeNode["type"], "ROOT_NODE">;
	form: UseFormReturn<AddForm, any, AddForm>;
	onAdd: SubmitHandler<AddForm>;
	siblingNames: string[];
};

export default function DLFABModalBodyAdd({
	type,
	form,
	onAdd,
	siblingNames,
}: Props) {
	return (
		<form onSubmit={form.handleSubmit(onAdd)}>
			{type == "subject" ? (
				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
					<legend className="fieldset-legend">
						Subject title & Characteristics
					</legend>

					<DLFABModalBodyAddName
						form={form}
						siblingNames={siblingNames}
					/>

					<label className="label mt-4">Context</label>
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
					<DLFABModalBodyAddName
						form={form}
						siblingNames={siblingNames}
					/>
				</div>
			)}
		</form>
	);
}
