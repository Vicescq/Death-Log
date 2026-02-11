import { Controller, type UseFormReturn } from "react-hook-form";
import { CONSTANTS } from "../../../../shared/constants";
import TooltipButton from "../../../components/TooltipButton";
import { isoToDateSTD, isoToTimeSTD } from "../utils/dateUtils";
import type { DeathCounterForm, EditDeathForm } from "./DeathLogCounter";
import type { Death, Subject } from "../../../model/TreeNodeModel";
import edit from "../../../assets/edit_single.svg";

type Props = {
	form: UseFormReturn<DeathCounterForm, any, DeathCounterForm>;
	subject: Subject;
	onFocusDeath: (id: string) => void;
	deathHistoryRef: React.RefObject<HTMLUListElement | null>;
	onDeleteDeathConfirm: (id: string) => void;
	sortedDeaths: Death[];
	focusedDeathID: string | null;
};

export default function DeathSettingsAndHistory({
	form,
	subject,
	deathHistoryRef,
	onFocusDeath,
	onDeleteDeathConfirm,
	sortedDeaths,
	focusedDeathID,
}: Props) {
	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box mb-0 w-full rounded-b-none border p-4 sm:mb-8 sm:rounded-2xl">
				<legend className="fieldset-legend">
					{!subject.completed
						? "Death Settings & History"
						: "Death History"}
				</legend>

				{!subject.completed ? (
					<>
						<label className="floating-label">
							<span>Death Remark (Optional)</span>
							<input
								type="search"
								placeholder="Wasnt my fault, died to a bug!"
								className="input w-full"
								{...form.register("remark")}
							/>
						</label>

						{form.formState.errors.remark && (
							<div className="text-error">
								{form.formState.errors.remark.message}
							</div>
						)}

						<div className="mt-4 flex">
							<span className="my-auto">
								Is Timestamp Reliable?
							</span>
							<TooltipButton
								tooltip={CONSTANTS.INFO.RELIABILITY}
								css="tooltip-primary"
							/>
							<div className="ml-auto">
								<div className="flex gap-2">
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
						</div>
					</>
				) : null}

				{!subject.completed && subject.log.length > 0 ? (
					<div className="label mt-4">Death History</div>
				) : null}
				<ul
					className="list max-h-[40rem] overflow-auto"
					ref={deathHistoryRef}
				>
					{sortedDeaths.map((death) => (
						<li
							className={`list-row flex ${focusedDeathID == death.id ? "bg-neutral" : ""}`}
							key={death.id}
						>
							<div className="flex flex-col gap-1">
								<div className="badge badge-neutral badge-sm flex gap-2">
									{isoToDateSTD(death.timestamp)}{" "}
									<span className="text-secondary">
										{isoToTimeSTD(death.timestamp)}
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

							{!subject.completed ? (
								<div className="my-auto ml-auto flex gap-2">
									<button
										className="cursor-pointer"
										onClick={() => onFocusDeath(death.id)}
									>
										<img
											src={edit}
											className="w-4"
											alt=""
										/>
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
							) : null}
						</li>
					))}
					{subject.log.length == 0 && subject.completed ? (
						<li className="list-row m-auto">No Deaths!</li>
					) : null}
				</ul>
			</fieldset>
		</>
	);
}
