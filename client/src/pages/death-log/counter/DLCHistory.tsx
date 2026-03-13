import type {
	Death,
	Subject,
} from "../../../model/tree-node-model/SubjectSchema";
import { isoToDateSTD, isoToTimeSTD } from "../../../utils/date";
import edit from "../../../assets/edit_single.svg";

type Props = {
	subject: Subject;
	deathHistoryRef: React.RefObject<HTMLUListElement | null>;
	sortedDeaths: Death[];
	focusedDeathID: string | null;
	onFocusDeath: (id: string) => void;
	onDeleteDeathConfirm: (id: string) => void;
};

export default function DLCHistory({
	subject,
	deathHistoryRef,
	sortedDeaths,
	focusedDeathID,
	onFocusDeath,
	onDeleteDeathConfirm,
}: Props) {
	return (
		<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full rounded-2xl border p-4">
			<legend className="fieldset-legend">Death History</legend>
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
						) : null}
					</li>
				))}
				{subject.log.length == 0 ? (
					<li className="list-row m-auto">No Deaths!</li>
				) : null}
			</ul>
		</fieldset>
	);
}
