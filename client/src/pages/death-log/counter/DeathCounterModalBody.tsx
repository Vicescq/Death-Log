import { CONSTANTS } from "../../../../shared/constants";
import {
	Controller,
	type SubmitHandler,
	type UseFormReturn,
} from "react-hook-form";
import type { FormDeath } from "./DeathLogCounter";

type Props = {
	type: "edit" | "delete";
	form: UseFormReturn<FormDeath, any, FormDeath>;
	onEditDeath: SubmitHandler<FormDeath>;
	onDeleteDeath: () => void;
};

export default function DeathCounterModalBody({
	type,
	form,
	onEditDeath,
	onDeleteDeath,
}: Props) {
	if (type == "edit") {
		return (
			<form onSubmit={form.handleSubmit(onEditDeath)}>
				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box my-1 w-full gap-2 border p-4">
					<legend className="fieldset-legend">
						Remark & Timestamps
					</legend>

					<label className="label">Remark</label>
					<input
						type="search"
						className="input bg-base-200 join-item"
						{...form.register("remark", {
							maxLength: {
								value: CONSTANTS.DEATH_REMARK_MAX,
								message: CONSTANTS.ERROR.MAX_LENGTH,
							},
						})}
					/>
					{form.formState.errors.remark && (
						<div className="text-error">
							{form.formState.errors.remark.message}
						</div>
					)}

					<div className="divider">↓ Timestamp Settings ↓</div>

					<label className="label">Date</label>
					<input
						type="date"
						className="input bg-base-200 join-item"
						{...form.register("date", {
							required: {
								value: true,
								message: "Date is required",
							},
						})}
					/>
					{form.formState.errors.date && (
						<div className="text-error">
							{form.formState.errors.date.message}
						</div>
					)}

					<label className="label">Time</label>
					<input
						type="time"
						className="input bg-base-200 join-item"
						step={1}
						{...form.register("time", {
							required: {
								value: true,
								message: "Date is required",
							},
						})}
					/>
					{form.formState.errors.time && (
						<div className="text-error">
							{form.formState.errors.time.message}
						</div>
					)}

					<div className="mt-4 flex items-center">
						<span className="">Is Timestamp Reliable?</span>
						<div className="ml-auto flex gap-2">
							<div className="flex items-center justify-center gap-1">
								Yes
								<input
									type="radio"
									className="radio"
									{...form.register("timestampRel")}
									value={"T"}
								/>
							</div>

							<div className="flex items-center justify-center gap-1">
								No
								<input
									type="radio"
									className="radio"
									{...form.register("timestampRel")}
									value={"F"}
								/>
							</div>
						</div>
					</div>
				</fieldset>
				<button
					type="submit"
					disabled={
						!form.formState.isValid || !form.formState.isDirty
					}
					className="btn btn-success my-2 w-full"
				>
					Confirm
				</button>
			</form>
		);
	} else {
		return (
			<button
				className="btn btn-error mt-4 w-full"
				onClick={onDeleteDeath}
			>
				Delete
			</button>
		);
	}
}
