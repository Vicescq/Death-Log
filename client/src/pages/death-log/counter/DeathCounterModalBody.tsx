import { CONSTANTS } from "../../../../shared/constants";
import { type SubmitHandler, type UseFormReturn } from "react-hook-form";
import type { DeathForm } from "./DeathLogCounter";

type Props = {
	type: "edit" | "delete";
	form: UseFormReturn<DeathForm, any, DeathForm>;
	onEditDeath: SubmitHandler<DeathForm>;
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

					<label className="floating-label">
						<span>Remark</span>
						<input
							type="search"
							className="input bg-base-200"
							{...form.register("remark")}
						/>
					</label>

					{form.formState.errors.remark && (
						<div className="text-error">
							{form.formState.errors.remark.message}
						</div>
					)}

					<div className="divider">↓ Timestamp Settings ↓</div>

					<label className="floating-label">
						<span>Date</span>
						<input
							type="date"
							className="input bg-base-200"
							{...form.register("date")}
						/>
					</label>
					{form.formState.errors.date && (
						<div className="text-error">
							{form.formState.errors.date.message}
						</div>
					)}

					<label className="floating-label mt-4">
						<span>Time</span>
						<input
							type="time"
							className="input bg-base-200"
							step={1}
							{...form.register("time")}
						/>
					</label>
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
					{CONSTANTS.DEATH_LOG_EDITOR.SUBMIT}
				</button>
				<button
					type="reset"
					disabled={!form.formState.isDirty}
					className="btn btn-primary w-full"
					onClick={(e) => {
						e.preventDefault();
						form.reset();
					}}
				>
					{CONSTANTS.DEATH_LOG_EDITOR.RESET}
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
