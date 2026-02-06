import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { AddForm } from "./DeathLogFAB";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { validateString } from "../../../stores/utils";
import { CONSTANTS } from "../../../../shared/constants";

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
			<div className="join my-2 w-full">
				<input
					type="search"
					className="input bg-base-200 join-item"
					{...form.register("name", {
						validate: (inputText) =>
							validateString(
								inputText,
								"add",
								siblingNames,
								null,
							),
						maxLength: {
							value: CONSTANTS.INPUT_MAX,
							message: "Too long!",
						},
					})}
				/>
				<button
					type="submit"
					className="btn join-item btn-success"
					disabled={!form.formState.isValid}
				>
					+
				</button>
			</div>
			{form.formState.errors.name && (
				<span className="text-error">
					{form.formState.errors.name.message}
				</span>
			)}
		</form>
	);
}
