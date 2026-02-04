import { CONSTANTS } from "../../../../shared/constants";
import {
	type FieldErrors,
	type SubmitHandler,
	type UseFormHandleSubmit,
	type UseFormRegister,
} from "react-hook-form";
import type { Death } from "../../../model/TreeNodeModel";

type Props = {
	type: "edit" | "delete";
	register: UseFormRegister<Death>;
	handleSubmit: UseFormHandleSubmit<Death, Death>;
	onSubmit: SubmitHandler<Death>;
	errors: FieldErrors<Death>;
	isValid: boolean;
};

export default function DeathCounterModalBody({
	type,
	register,
	handleSubmit,
	onSubmit,
	errors,
	isValid,
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
						// {...register("timestamp")}
						// value={formatUTCDate(editedDeathEntry.timestamp)}
						// onChange={(e) =>
						// 	setEditedDeathEntry({
						// 		...editedDeathEntry,
						// 		timestamp: toUTCDate(
						// 			e.currentTarget.value,
						// 			formatUTCTime(editedDeathEntry.timestamp),
						// 		),
						// 	})
						// }
					/>

					<label className="label">Time</label>
					<input
						type="time"
						className="input bg-base-200 join-item"
						step={1}
						// value={formatUTCTime(editedDeathEntry.timestamp)}
						// onChange={(e) =>
						// 	setEditedDeathEntry({
						// 		...editedDeathEntry,
						// 		timestamp: toUTCDate(
						// 			formatUTCDate(editedDeathEntry.timestamp),
						// 			e.currentTarget.value,
						// 		),
						// 	})
						// }
					/>

					<span className="mt-4">Is Timestamp Reliable?</span>
					<div className="flex gap-2">
						<div className="flex items-center justify-center gap-1">
							Yes
							<input
								type="radio"
								className="radio"
								value={"true"}
								{...register("timestampRel", {
									setValueAs: (v) => v === "true",
								})}
								// {...register("timestampRel")}
								// checked={editedDeathEntry.timestampRel}
								// onChange={(e) =>
								// 	setEditedDeathEntry({
								// 		...editedDeathEntry,
								// 		timestampRel: e.currentTarget.checked,
								// 	})
								// }
							/>
						</div>

						<div className="flex items-center justify-center gap-1">
							No
							<input
								type="radio"
								className="radio radio-error"
								value={"false"}
								{...register("timestampRel", {
									setValueAs: (v) => v === "true",
								})}
								// checked={!editedDeathEntry.timestampRel}
								// onChange={(e) =>
								// 	setEditedDeathEntry({
								// 		...editedDeathEntry,
								// 		timestampRel: !e.currentTarget.checked,
								// 	})
								// }
							/>
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
		return <></>;
	}
}
