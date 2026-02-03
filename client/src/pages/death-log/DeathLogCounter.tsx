import { useDeathLogStore } from "../../stores/useDeathLogStore";
import up from "../../assets/up.svg";
import down from "../../assets/down.svg";
import DeathLogBreadcrumb from "./DeathLogBreadcrumb";
import NavBar from "../../components/navBar/NavBar";
import type { Subject } from "../../model/TreeNodeModel";
import { createDeath } from "../../stores/utils";
import { useRef, useState } from "react";
import { formatUTCDate, formatUTCTime } from "./utils";
import Modal from "../../components/Modal";
import TooltipButton from "../../components/TooltipButton";

type Props = {
	subject: Subject;
};

export default function DeathLogCounter({ subject }: Props) {
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const [remark, setRemark] = useState<string | null>(null);
	const [timestampRel, setTimestampRel] = useState(true);
	const remarkModalRenameRef = useRef<HTMLDialogElement>(null);
	return (
		<>
			<NavBar
				midNavContent={<></>}
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			<div className="m-auto mt-4 flex w-[93%] flex-col items-center justify-center rounded-4xl md:w-3xl">
				<h1 className="mx-6 w-fit rounded-2xl p-6 text-center text-4xl md:text-6xl">
					{subject.name}
				</h1>

				<div className="my-4 flex flex-col gap-4">
					<img
						src={up}
						className="m-auto w-8"
						onClick={() => {
							updateNode(subject, {
								...subject,
								log: [
									...subject.log,
									createDeath(subject.id, remark),
								],
							});
							setRemark(null);
						}}
					/>

					<span className={`text-center text-6xl`}>
						{subject.log.length}
					</span>

					<img
						src={down}
						className="m-auto w-8"
						onClick={() => {
							if (subject.log.length > 0) {
								const log = [...subject.log];
								log.pop();
								updateNode(subject, {
									...subject,
									log: log,
								});
							}
						}}
					/>
				</div>

				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box mb-8 w-full border p-4">
					<legend className="fieldset-legend">
						Remarks & Death History
					</legend>
					<label className="label">Death Remark</label>
					<input
						type="search"
						placeholder="Type your remark and add a death"
						className="input w-full"
						value={remark == null ? "" : remark}
						onChange={(e) => {
							if (e.currentTarget.value == "") {
								setRemark(null);
							} else {
								setRemark(e.currentTarget.value);
							}
						}}
						maxLength={20}
					/>

					<div className="mt-4 flex">
						<span className="my-auto">Is Timestamp Reliable?</span>
						<TooltipButton
							tooltip="Click no if you want to
							record a death but want to flag it as unreliable."
							css="tooltip-primary"
						/>
						<div className="ml-auto">
							<div className="flex gap-2">
								<div className="flex items-center justify-center gap-1">
									Yes
									<input
										type="radio"
										name="radio-1"
										className="radio"
										defaultChecked
									/>
								</div>

								<div className="flex items-center justify-center gap-1">
									No
									<input
										type="radio"
										name="radio-1"
										className="radio radio-error"
									/>
								</div>
							</div>
						</div>
					</div>

					<label className="label mt-8">Death History</label>
					<ul className="list max-h-96 overflow-auto">
						{subject.log.length == 0 ? (
							<span className="text-error">
								This subject has no death log history! Start by
								adding a death!
							</span>
						) : null}

						{subject.log
							.map((death, i) => (
								<li className="list-row flex">
									<div className="flex flex-col gap-1">
										<div className="badge badge-neutral badge-sm flex gap-2">
											{formatUTCDate(death.timestamp)}{" "}
											<span className="text-secondary">
												{formatUTCTime(death.timestamp)}
											</span>
										</div>

										{death.remark != null ? (
											<div className="badge badge-sm badge-success">
												Remark: {death.remark}
											</div>
										) : null}

										{!death.timestampRel ? (
											<div className="badge badge-sm badge-error">
												Unreliable Time
											</div>
										) : null}
									</div>

									<div className="my-auto ml-auto">
										<button
											className="cursor-pointer"
											onClick={() =>
												remarkModalRenameRef.current?.showModal()
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
			</div>
			<Modal
				ref={remarkModalRenameRef}
				content={
					<div className="join my-4 w-full">
						<input
							type="search"
							className="input bg-base-200 join-item"
						/>
						<button className="join-item btn btn-success">
							Confirm
						</button>
					</div>
				}
				closeBtnName="Cancel"
				header="Rename remark"
				modalBtns={[]}
			/>
		</>
	);
}
