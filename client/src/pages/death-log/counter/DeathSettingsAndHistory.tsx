import { Controller, type UseFormReturn } from "react-hook-form";
import { CONSTANTS } from "../../../../shared/constants";
import TooltipButton from "../../../components/TooltipButton";
import { formatUTCDate, formatUTCTime } from "../utils";
import type { FormDeath } from "./DeathLogCounter";
import type { Subject } from "../../../model/TreeNodeModel";
import edit from "../../../assets/edit_single.svg";

type Props = {
	form: UseFormReturn<FormDeath, any, FormDeath>;
	subject: Subject;
	onFocusDeath: (id: string) => void;
	deathHistoryRef: React.RefObject<HTMLUListElement | null>;
	onDeleteDeathConfirm: (id: string) => void;
};

export default function DeathSettingsAndHistory({
	form,
	subject,
	deathHistoryRef,
	onFocusDeath,
	onDeleteDeathConfirm,
}: Props) {
	const sortedDeaths = subject.log.toSorted(
		(a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
	);
	return (
		<fieldset className="fieldset bg-base-200 border-base-300 rounded-box mb-0 w-full rounded-b-none border p-4 sm:mb-8 sm:rounded-2xl">
			<legend className="fieldset-legend">
				Death Settings & History
			</legend>

			<label className="label">Death Remark</label>
			<input
				type="search"
				placeholder="Wasnt my fault, died to a bug!"
				className="input w-full"
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

			<div className="mt-4 flex">
				<span className="my-auto">Is Timestamp Reliable?</span>
				<TooltipButton
					tooltip={CONSTANTS.RELIABILITY}
					css="tooltip-primary"
				/>
				<div className="ml-auto">
					<div className="flex gap-2">
						<div className="flex items-center justify-center gap-1">
							Yes
							<Controller
								control={form.control}
								name="timestampRel"
								render={({ field: { onChange, value } }) => (
									<input
										type="radio"
										className="radio"
										checked={value === true}
										onChange={() => onChange(true)}
									/>
								)}
							/>
						</div>

						<div className="flex items-center justify-center gap-1">
							No
							<Controller
								control={form.control}
								name="timestampRel"
								render={({ field: { onChange, value } }) => (
									<input
										type="radio"
										className="radio radio-error"
										checked={value === false}
										onChange={() => onChange(false)}
									/>
								)}
							/>
						</div>
					</div>
				</div>
			</div>

			<label className="label mt-8">Death History</label>
			<ul
				className="list max-h-[40rem] overflow-auto"
				ref={deathHistoryRef}
			>
				{subject.log.length == 0 ? (
					<span className="text-error">
						This subject has no death log history! Start by adding a
						death!
					</span>
				) : null}

				{sortedDeaths
					.map((death) => (
						<li className="list-row flex" key={death.id}>
							<div className="flex flex-col gap-1">
								<div className="badge badge-neutral badge-sm flex gap-2">
									{formatUTCDate(death.timestamp)}{" "}
									<span className="text-secondary">
										{formatUTCTime(death.timestamp)}
									</span>
								</div>
								{death.remark != null ? (
									<div className="badge badge-sm badge-success">
										{death.remark}
									</div>
								) : null}

								{!death.timestampRel ? (
									<div className="badge badge-sm badge-error">
										Unreliable Time
									</div>
								) : null}
							</div>

							<div className="my-auto ml-auto flex gap-2">
								<button
									className="cursor-pointer"
									onClick={() => onFocusDeath(death.id)}
								>
									<img src={edit} className="w-4" alt="" />
								</button>
								<button
									className="cursor-pointer"
									onClick={() =>
										onDeleteDeathConfirm(death.id)
									}
								>
									✕
								</button>
							</div>
						</li>
					))
					.reverse()}
			</ul>
		</fieldset>
	);
}
