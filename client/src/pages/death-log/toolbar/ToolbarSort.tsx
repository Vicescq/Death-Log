import type { UseFormReturn, SubmitHandler } from "react-hook-form";
import type { SortSettings } from "../formSchemas";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";

type Props = {
	form: UseFormReturn<SortSettings>;
	nodeType: Exclude<DistinctTreeNode["type"], "ROOT_NODE">;
	onSort: SubmitHandler<SortSettings>;
	onReset: () => void;
};

export default function ToolbarSort({
	form,
	onReset,
	onSort,
	nodeType,
}: Props) {
	return (
		<form onSubmit={form.handleSubmit(onSort)}>
			<div className="flex flex-col gap-1">
				<div className="my-1">
					<label>
						<div className="flex gap-4">
							<input
								type="checkbox"
								className="checkbox checkbox-info"
								{...form.register("ascending")}
							/>
							Ascending
						</div>
					</label>
				</div>

				<div className="my-1">
					<div className="text-info mb-2">Sorting Key</div>
					<ul className="flex flex-col gap-2">
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="radio"
										className="radio radio-info"
										{...form.register("sortingKey")}
										value={"created"}
									/>
									Date Created
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="radio"
										className="radio radio-info"
										{...form.register("sortingKey")}
										value={"completed"}
									/>
									Date Completed
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="radio"
										className="radio radio-info"
										{...form.register("sortingKey")}
										value={"name"}
									/>
									Name
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="radio"
										className="radio radio-info"
										{...form.register("sortingKey")}
										value={"deaths"}
									/>
									Death Count
								</div>
							</label>
						</li>
						{nodeType == "subject" ? (
							<li>
								<label>
									<div className="flex gap-4">
										<input
											type="radio"
											className="radio radio-info"
											{...form.register("sortingKey")}
											value={"timeSpent"}
										/>
										Time Spent
									</div>
								</label>
							</li>
						) : null}
					</ul>
				</div>

				<div className="my-1 text-sm">
					Note that if sorting based on Date Completed, it will put
					uncompleted items always at the end of the list!
				</div>

				<button
					type="submit"
					className="btn btn-success mt-2 w-full"
					disabled={
						!form.formState.isValid || !form.formState.isDirty
					}
				>
					Confirm
				</button>
				<button
					type="reset"
					className="btn btn-info w-full"
					onClick={(e) => {
						e.preventDefault();
						onReset();
					}}
				>
					Reset to defaults
				</button>
			</div>
		</form>
	);
}
