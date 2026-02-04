import { CONSTANTS } from "../../../../shared/constants";
import {
	Controller,
	type Control,
	type FieldErrors,
	type SubmitHandler,
	type UseFormHandleSubmit,
	type UseFormRegister,
} from "react-hook-form";
import type { FormDeath } from "./DeathLogCounter";

type Props = {
	type: "edit" | "delete";
	register: UseFormRegister<FormDeath>;
	handleSubmit: UseFormHandleSubmit<FormDeath, FormDeath>;
	onSubmit: SubmitHandler<FormDeath>;
	errors: FieldErrors<FormDeath>;
	isValid: boolean;
	control: Control<FormDeath, any, FormDeath>;
	onDelete: () => void;
};

export default function DeathCounterModalBody({
	type,
	register,
	handleSubmit,
	onSubmit,
	errors,
	isValid,
	control,
	onDelete,
}: Props) {
	if (type == "edit") {
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box my-1 w-full gap-2 border p-4">
					<legend className="fieldset-legend">
						Remark & Timestamps
					</legend>

					<label className="label">Remark</label>
					<input
						type="search"
						className="input bg-base-200 join-item"
						{...register("remark", {
							maxLength: {
								value: CONSTANTS.DEATH_REMARK_MAX,
								message: CONSTANTS.ERROR.MAX_LENGTH,
							},
						})}
					/>
					{errors.remark && (
						<div className="text-error">
							{errors.remark.message}
						</div>
					)}

					<div className="divider">↓ Timestamp Settings ↓</div>

					<label className="label">Date</label>
					<input
						type="date"
						className="input bg-base-200 join-item"
						{...register("date")}
					/>

					<label className="label">Time</label>
					<input
						type="time"
						className="input bg-base-200 join-item"
						step={1}
						{...register("time")}
					/>
					<div className="mt-4 flex items-center">
						<span className="">Is Timestamp Reliable?</span>
						<div className="ml-auto flex gap-2">
							<div className="flex items-center justify-center gap-1">
								Yes
								<Controller
									control={control}
									name="timestampRel"
									render={({
										field: { onChange, value },
									}) => (
										<input
											type="radio"
											className="radio"
											onChange={() => onChange(true)}
											checked={value === true}
										/>
									)}
								/>
							</div>

							<div className="flex items-center justify-center gap-1">
								No
								<Controller
									control={control}
									name="timestampRel"
									render={({
										field: { onChange, value },
									}) => (
										<input
											type="radio"
											className="radio radio-error"
											onChange={() => onChange(false)}
											checked={value === false}
										/>
									)}
								/>
							</div>
						</div>
					</div>
				</fieldset>
				<button
					type="submit"
					disabled={!isValid}
					className="btn btn-success my-2 w-full"
				>
					Confirm
				</button>
			</form>
		);
	} else {
		return (
			<button className="btn btn-error mt-4 w-full" onClick={onDelete}>
				Delete
			</button>
		);
	}
}
