import {
	useWatch,
	type SubmitHandler,
	type UseFormReturn,
	type UseFormWatch,
} from "react-hook-form";
import { CONSTANTS } from "../../../../shared/constants";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";
import type { ProfileGroup } from "../../../model/tree-node-model/ProfileSchema";
import { isoToDateSTD } from "../../../utils/date";
import { type Filters } from "../../../model/formSchemas";
import { useState } from "react";

type Props = {
	form: UseFormReturn<Filters>;
	nodeType: Exclude<DistinctTreeNode["type"], "ROOT_NODE">;
	groupings: ProfileGroup[];
	onFilter: SubmitHandler<Filters>;
	onReset: () => void;
};

export default function ToolbarFilter({
	form,
	nodeType,
	groupings,
	onFilter,
	onReset,
}: Props) {
	const dateRangeEnabled = form.watch("dateRangeEnabled");

	return (
		<form onSubmit={form.handleSubmit(onFilter)}>
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
									{...form.register("dateRangeEnabled", {
										onChange: () => {
											if (
												!form.getValues(
													"dateRangeEnabled",
												)
											) {
												form.setValue(
													"dateFrom",
													isoToDateSTD(
														new Date().toISOString(),
													),
													{ shouldValidate: true },
												);
												form.setValue(
													"dateTo",
													isoToDateSTD(
														new Date().toISOString(),
													),
													{ shouldValidate: true },
												);
											}
										},
									})}
								/>
								Enable Date Range Filters
							</div>
						</label>
					</div>

					{dateRangeEnabled ? (
						<>
							<div className="flex gap-4">
								<label className="floating-label w-full">
									<span>From</span>
									<input
										type="date"
										className="input"
										{...form.register("dateFrom")}
									/>
								</label>
								<label className="floating-label w-full">
									<span>To</span>
									<input
										type="date"
										className="input"
										{...form.register("dateTo")}
									/>
								</label>
							</div>
							<div className="text-accent text-sm">
								{CONSTANTS.INFO.DATE_RANGE}
							</div>
						</>
					) : null}
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
										{...form.register("reliableStart")}
									/>
									Show entries flagged as reliable (creation
									date)
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="checkbox"
										className="checkbox checkbox-info"
										{...form.register("unreliableStart")}
									/>
									Show entries flagged as unreliable (creation
									date)
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="checkbox"
										className="checkbox checkbox-info"
										{...form.register("reliableEnd")}
									/>
									Show entries flagged as reliable (completion
									date)
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="checkbox"
										className="checkbox checkbox-info"
										{...form.register("unreliableEnd")}
									/>
									Show entries flagged as unreliable
									(completion date)
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

				{nodeType == "subject" ? (
					<>
						<div className="my-1">
							<div className="text-info mb-3">
								Subject Contexts
							</div>

							<ul className="flex flex-col gap-2">
								<li>
									<label>
										<div className="flex gap-4">
											<input
												type="checkbox"
												className="checkbox checkbox-info"
												{...form.register("boss")}
											/>
											Show bosses
										</div>
									</label>
								</li>
								<li>
									<label>
										<div className="flex gap-4">
											<input
												type="checkbox"
												className="checkbox checkbox-info"
												{...form.register("location")}
											/>
											Show locations
										</div>
									</label>
								</li>
								<li>
									<label>
										<div className="flex gap-4">
											<input
												type="checkbox"
												className="checkbox checkbox-info"
												{...form.register(
													"genericEnemy",
												)}
											/>
											Show generic enemies
										</div>
									</label>
								</li>
								<li>
									<label>
										<div className="flex gap-4">
											<input
												type="checkbox"
												className="checkbox checkbox-info"
												{...form.register("miniBoss")}
											/>
											Show mini bosses
										</div>
									</label>
								</li>
								<li>
									<label>
										<div className="flex gap-4">
											<input
												type="checkbox"
												className="checkbox checkbox-info"
												{...form.register("other")}
											/>
											Show subjects classified as `other`
										</div>
									</label>
								</li>
							</ul>
						</div>
						<div className="my-1">
							<div className="text-info mb-3">
								Time Spent Display
							</div>

							<ul className="flex flex-col gap-2">
								<li>
									<label>
										<div className="flex gap-4">
											<input
												type="checkbox"
												className="checkbox checkbox-info"
												{...form.register("timeSpent")}
											/>
											Show entries that have time spent
										</div>
									</label>
								</li>
								<li>
									<label>
										<div className="flex gap-4">
											<input
												type="checkbox"
												className="checkbox checkbox-info"
												{...form.register(
													"noTimeSpent",
												)}
											/>
											Show entries that have no time spent
										</div>
									</label>
								</li>
							</ul>
						</div>

						{groupings.length > 0 ? (
							<div className="my-1">
								<div className="text-info mb-3">
									Profile Groups
								</div>
								<ul className="flex flex-col gap-2">
									{groupings.map((group) => (
										<li key={group.id}>
											<label>
												<div className="flex gap-4">
													<input
														type="checkbox"
														className="checkbox checkbox-info"
														value={group.id}
														{...form.register(
															"groupIDs",
														)}
													/>
													{group.title}
												</div>
											</label>
										</li>
									))}
								</ul>
								<div className="text-accent mt-4 text-sm">
									{CONSTANTS.INFO.GROUP_FILTER}
								</div>
							</div>
						) : null}
					</>
				) : null}

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
