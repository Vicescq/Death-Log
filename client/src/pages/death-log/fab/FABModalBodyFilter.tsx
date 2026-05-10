import { useForm, type SubmitHandler } from "react-hook-form";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";
import { FiltersSchema, type Filters } from "../formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { isoToDateSTD } from "../../../utils/date";
import { CONSTANTS } from "../../../../shared/constants";
import LocalDB from "../../../services/LocalDB";

type Props = {
	type: "flt" | "sort";
	nodeType: Exclude<DistinctTreeNode["type"], "ROOT_NODE">;
	onClose: () => void;
};

export default function FABModalBodyFilter({ type, nodeType, onClose }: Props) {
	const defaultFilters: Filters = {
		uncompleted: true,
		completed: true,
		reoccurring: true,
		azRange: "A-Z",
		dateFrom: isoToDateSTD(new Date().toISOString()),
		dateTo: isoToDateSTD(new Date().toISOString()),
		dateRangeEnabled: false,
		deathRange: ">=0",
		reliable: true,
		unreliable: true,
		notes: true,
		noNotes: true,
	};
	const filterPrefs = LocalDB.getDLFilterPrefs();
	const form = useForm<Filters>({
		defaultValues: filterPrefs != null ? filterPrefs : defaultFilters,
		mode: "onChange",
		resolver: zodResolver(FiltersSchema),
	});

	const onSubmit: SubmitHandler<Filters> = (formData) => {
		LocalDB.setDLFilterPrefs(formData);
		onClose();
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-1">
				<div className="my-1">
					<div className="text-info mb-2">Displayed Statuses</div>
					<ul className="flex flex-col gap-2">
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="checkbox"
										className="checkbox checkbox-info"
										{...form.register("uncompleted")}
									/>
									Uncompleted
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="checkbox"
										className="checkbox checkbox-info"
										{...form.register("completed")}
									/>
									Completed
								</div>
							</label>
						</li>

						{nodeType == "subject" ? (
							<li>
								<label>
									<div className="flex gap-4">
										<input
											type="checkbox"
											className="checkbox checkbox-info"
											{...form.register("reoccurring")}
										/>
										Reoccurring
									</div>
								</label>
							</li>
						) : null}
					</ul>
				</div>

				<div className="my-1">
					<div className="text-info mb-3">Alphabet Range</div>
					<input
						type="text"
						className="input"
						{...form.register("azRange")}
					/>
					{form.formState.errors && form.formState.errors.azRange ? (
						<div className="text-error">
							{form.formState.errors.azRange.message}
						</div>
					) : null}
					<div className="text-accent text-sm">
						{CONSTANTS.INFO.AZ_RANGE}
					</div>
				</div>

				<div className="my-1">
					<div className="text-info">Date Range</div>
					<div className="mb-4 flex">
						<label>
							<div className="flex gap-4">
								<input
									type="checkbox"
									className="checkbox checkbox-info"
									{...form.register("dateRangeEnabled")}
								/>
								Date Range Filters
							</div>
						</label>
					</div>
					<div className="flex gap-4">
						<label className="floating-label w-full">
							<span>From</span>
							<input
								type="date"
								className="input"
								{...form.register("dateFrom")}
								disabled={!form.getValues("dateRangeEnabled")}
							/>
						</label>
						<label className="floating-label w-full">
							<span>To</span>
							<input
								type="date"
								className="input"
								{...form.register("dateTo")}
								disabled={!form.getValues("dateRangeEnabled")}
							/>
						</label>
					</div>
					<div className="text-accent text-sm">
						{CONSTANTS.INFO.DATE_RANGE}
					</div>
				</div>

				<div className="my-1">
					<div className="text-info mb-3">Death Range</div>
					<input
						type="text"
						className="input"
						{...form.register("deathRange")}
					/>
					{form.formState.errors &&
					form.formState.errors.deathRange ? (
						<div className="text-error">
							{form.formState.errors.deathRange.message}
						</div>
					) : null}
					<div className="text-accent text-sm">
						{CONSTANTS.INFO.DEATH_RANGE}
					</div>
				</div>

				<div className="my-1">
					<div className="text-info mb-3">
						Date Reliability Flags Display
					</div>
					<ul className="flex flex-col gap-2">
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="checkbox"
										className="checkbox checkbox-info"
										{...form.register("reliable")}
									/>
									Show entries flagged as reliable
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="checkbox"
										className="checkbox checkbox-info"
										{...form.register("unreliable")}
									/>
									Show entries flagged as unreliable
								</div>
							</label>
						</li>
					</ul>
				</div>

				<div className="my-1">
					<div className="text-info mb-3">Notes Display</div>
					<ul className="flex flex-col gap-2">
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="checkbox"
										className="checkbox checkbox-info"
										{...form.register("notes")}
									/>
									Show entries that have notes
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="checkbox"
										className="checkbox checkbox-info"
										{...form.register("noNotes")}
									/>
									Show entries that have no notes
								</div>
							</label>
						</li>
					</ul>
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
						form.reset(defaultFilters);
						LocalDB.setDLFilterPrefs(defaultFilters);
					}}
				>
					Reset to defaults
				</button>
			</div>
		</form>
	);
}
