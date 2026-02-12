import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { CONSTANTS } from "../../../../shared/constants";
import type { UseFormReturn } from "react-hook-form";
import type { NodeFormEdit } from "../schema";
import { useState } from "react";

type Props = {
	node: DistinctTreeNode;
	form: UseFormReturn<NodeFormEdit, any, NodeFormEdit>;
};

export default function DLCEDate({ node, form }: Props) {
	return (
		<>
			<label className="floating-label">
				<span>Date Created</span>
				<input
					type="date"
					className={`input ${form.formState.dirtyFields.dateStart ? "input-primary" : ""} join-item w-full`}
					{...form.register("dateStart", {
						onChange: () =>
							form.setValue("timeStart", "00:00:00", {
								shouldDirty: true,
								shouldValidate: true,
							}),
					})}
					disabled={
						form.formState.dirtyFields.dateEnd ||
						form.formState.dirtyFields.timeEnd
					}
				/>
				{form.formState.errors.dateStart && (
					<div className="text-error">
						{form.formState.errors.dateStart.message}
					</div>
				)}
			</label>

			<label className="floating-label">
				<span>Time Created</span>
				<input
					type="time"
					className={`input ${form.formState.dirtyFields.timeStart ? "input-primary" : ""} join-item w-full`}
					{...form.register("timeStart", {
						onChange: () => {
							form.trigger("dateStart");
						},
					})}
					step={1}
					disabled={
						form.formState.dirtyFields.dateEnd ||
						form.formState.dirtyFields.timeEnd
					}
				/>
				{form.formState.errors.timeStart && (
					<div className="text-error">
						{form.formState.errors.timeStart.message}
					</div>
				)}
			</label>

			{node.completed && node.dateEnd ? (
				<>
					<label className="floating-label">
						<span>Date Completed</span>
						<input
							type="date"
							className={`input ${form.formState.dirtyFields.dateEnd ? "input-primary" : ""} join-item w-full`}
							{...form.register("dateEnd", {
								onChange: () =>
									form.setValue("timeEnd", "00:00:00", {
										shouldDirty: true,
										shouldValidate: true,
									}),
							})}
							disabled={
								form.formState.dirtyFields.dateStart ||
								form.formState.dirtyFields.timeStart
							}
						/>
						{form.formState.errors.dateEnd && (
							<div className="text-error">
								{form.formState.errors.dateEnd.message}
							</div>
						)}
					</label>
					<label className="floating-label">
						<span>Time Completed</span>
						<input
							type="time"
							className={`input ${form.formState.dirtyFields.timeEnd ? "input-primary" : ""} join-item w-full`}
							{...form.register("timeEnd", {
								onChange: () => {
									form.trigger("dateEnd");
								},
							})}
							step={1}
							disabled={
								form.formState.dirtyFields.dateStart ||
								form.formState.dirtyFields.timeStart
							}
						/>
						{form.formState.errors.timeEnd && (
							<div className="text-error">
								{form.formState.errors.timeEnd.message}
							</div>
						)}
					</label>
				</>
			) : null}

			<div>
				<div className="divider my-1">
					<div
						className="tooltip tooltip-info"
						data-tip={CONSTANTS.INFO.RELIABILITY}
					>
						↓ Reliability Flags ↓
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex">
						<label
							htmlFor="creation-date-reliable-toggle"
							className={`text-[1rem] ${form.formState.dirtyFields.startRel ? "text-success" : ""}`}
						>
							Creation Timestamp
						</label>
						<input
							id="creation-date-reliable-toggle"
							type="checkbox"
							className="toggle toggle-primary my-auto ml-auto"
							{...form.register("startRel")}
						/>
					</div>

					{node.completed ? (
						<div className="flex">
							<label
								htmlFor="completion-date-reliable-toggle"
								className={`text-[1rem] ${form.formState.dirtyFields.endRel ? "text-success" : ""}`}
							>
								Completion Timestamp
							</label>
							<input
								id="completion-date-reliable-toggle"
								type="checkbox"
								className="toggle toggle-primary my-auto ml-auto"
								{...form.register("endRel")}
							/>
						</div>
					) : null}
				</div>
				<div className="divider my-1"></div>
			</div>
		</>
	);
}
