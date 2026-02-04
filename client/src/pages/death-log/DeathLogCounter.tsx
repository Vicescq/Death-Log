import { useDeathLogStore } from "../../stores/useDeathLogStore";
import up from "../../assets/up.svg";
import down from "../../assets/down.svg";
import DeathLogBreadcrumb from "./DeathLogBreadcrumb";
import NavBar from "../../components/navBar/NavBar";
import type { Death, Subject } from "../../model/TreeNodeModel";
import { createDeath, formatString } from "../../stores/utils";
import { useRef, useState } from "react";
import { formatUTCDate, formatUTCTime, toUTCDate } from "./utils";
import Modal, { type ModalBtn } from "../../components/Modal";
import TooltipButton from "../../components/TooltipButton";
import { CONSTANTS } from "../../../shared/constants";
import edit from "../../assets/edit_single.svg";
import { assertIsNonNull } from "../../utils";

type Props = {
	subject: Subject;
};

export default function DeathLogCounter({ subject }: Props) {
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const [remark, setRemark] = useState<string | null>(null);
	const [timestampRel, setTimestampRel] = useState(true);
	const modalRef = useRef<HTMLDialogElement>(null);
	const [modalBodyType, setModalBodyType] = useState<"edit" | "delete">(
		"edit",
	);
	const [focusedDeathIndex, setFocusedDeathIndex] = useState<number | null>(
		null,
	);
	const [editedDeathEntry, setEditedDeathEntry] = useState<Death | null>(
		null,
	);

	const modalBody =
		modalBodyType == "edit" && editedDeathEntry ? (
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box my-1 w-full gap-2 border p-4">
				<legend className="fieldset-legend">Remark & Timestamps</legend>

				<label className="label">Remark</label>
				<input
					type="search"
					className="input bg-base-200 join-item"
					value={
						editedDeathEntry.remark != null
							? editedDeathEntry.remark
							: ""
					}
					onChange={(e) => {
						setEditedDeathEntry({
							...editedDeathEntry,
							remark:
								e.currentTarget.value == ""
									? null
									: e.currentTarget.value,
						});
					}}
					onBlur={(e) => {
						const formattedStr = formatString(
							e.currentTarget.value,
						);
						setEditedDeathEntry({
							...editedDeathEntry,
							remark: formattedStr == "" ? null : formattedStr,
						});
					}}
					maxLength={CONSTANTS.DEATH_REMARK_MAX}
				/>

				<div className="divider">↓ Timestamp Settings ↓</div>

				<label className="label">Date</label>
				<input
					type="date"
					className="input bg-base-200 join-item"
					value={formatUTCDate(editedDeathEntry.timestamp)}
					onChange={(e) =>
						setEditedDeathEntry({
							...editedDeathEntry,
							timestamp: toUTCDate(
								e.currentTarget.value,
								formatUTCTime(editedDeathEntry.timestamp),
							),
						})
					}
				/>

				<label className="label">Time</label>
				<input
					type="time"
					className="input bg-base-200 join-item"
					value={formatUTCTime(editedDeathEntry.timestamp)}
					step={1}
					onChange={(e) =>
						setEditedDeathEntry({
							...editedDeathEntry,
							timestamp: toUTCDate(
								formatUTCDate(editedDeathEntry.timestamp),
								e.currentTarget.value,
							),
						})
					}
				/>

				<span className="mt-4">Is Timestamp Reliable?</span>
				<div className="flex gap-2">
					<div className="flex items-center justify-center gap-1">
						Yes
						<input
							type="radio"
							name="radio-2"
							className="radio"
							checked={editedDeathEntry.timestampRel}
							onChange={(e) =>
								setEditedDeathEntry({
									...editedDeathEntry,
									timestampRel: e.currentTarget.checked,
								})
							}
						/>
					</div>

					<div className="flex items-center justify-center gap-1">
						No
						<input
							type="radio"
							name="radio-2"
							className="radio radio-error"
							checked={!editedDeathEntry.timestampRel}
							onChange={(e) =>
								setEditedDeathEntry({
									...editedDeathEntry,
									timestampRel: !e.currentTarget.checked,
								})
							}
						/>
					</div>
				</div>
			</fieldset>
		) : (
			<></>
		);

	const modalBtn: ModalBtn | null =
		modalBodyType == "delete"
			? {
					text: "Delete",
					css: "btn-error",
					disabled: false,
					fn: () => {
						assertIsNonNull(focusedDeathIndex);
						updateNode(subject, {
							...subject,
							log: subject.log.filter(
								(_, index) => index != focusedDeathIndex,
							),
						});
						modalRef.current?.close();
					},
				}
			: {
					text: "Save edits",
					css: "btn-success",
					disabled: false,
					fn: () => {
						updateNode(subject, {
							...subject,
							log: subject.log.map((death, i) => {
								if (i == focusedDeathIndex) {
									assertIsNonNull(editedDeathEntry);
									return editedDeathEntry;
								} else return death;
							}),
						});
						modalRef.current?.close();
					},
				};

	const modalHeader =
		modalBodyType == "edit" ? "Edit Death Entry" : "Delete this death?";

	return (
		<>
			<NavBar
				midNavContent={<></>}
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			<div className="m-auto mt-4 flex w-full flex-col items-center justify-center rounded-4xl sm:w-[85%] md:w-2xl">
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
									createDeath(
										subject.id,
										remark,
										timestampRel,
									),
								],
							});
							setRemark(null);
							setTimestampRel(true);
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

				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box mb-0 w-full rounded-b-none border p-4 sm:mb-8 sm:rounded-2xl">
					<legend className="fieldset-legend">
						Remarks & Death History
					</legend>
					<label className="label">Death Remark</label>
					<input
						type="search"
						placeholder="Wasnt my fault, died to a bug!"
						className="input w-full"
						value={remark == null ? "" : remark}
						onChange={(e) => {
							if (e.currentTarget.value == "") {
								setRemark(null);
							} else {
								setRemark(e.currentTarget.value);
							}
						}}
						maxLength={CONSTANTS.DEATH_REMARK_MAX}
					/>

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
									<input
										type="radio"
										name="radio-1"
										className="radio"
										checked={timestampRel}
										onChange={(e) =>
											setTimestampRel(
												e.currentTarget.checked,
											)
										}
									/>
								</div>

								<div className="flex items-center justify-center gap-1">
									No
									<input
										type="radio"
										name="radio-1"
										className="radio radio-error"
										checked={!timestampRel}
										onChange={(e) =>
											setTimestampRel(
												!e.currentTarget.checked,
											)
										}
									/>
								</div>
							</div>
						</div>
					</div>

					<label className="label mt-8">Death History</label>
					<ul className="list max-h-[40rem] overflow-auto">
						{subject.log.length == 0 ? (
							<span className="text-error">
								This subject has no death log history! Start by
								adding a death!
							</span>
						) : null}

						{subject.log
							.map((death, i) => (
								<li className="list-row flex" key={i}>
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
											onClick={() => {
												setFocusedDeathIndex(i);
												setModalBodyType("edit");
												setEditedDeathEntry({
													...subject.log[i],
												});
												modalRef.current?.showModal();
											}}
										>
											<img
												src={edit}
												className="w-4"
												alt=""
											/>
										</button>
										<button
											className="cursor-pointer"
											onClick={() => {
												setModalBodyType("delete");
												setFocusedDeathIndex(i);
												modalRef.current?.showModal();
											}}
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
				ref={modalRef}
				content={modalBody}
				closeBtnName="Cancel"
				header={modalHeader}
				modalBtns={modalBtn ? [modalBtn] : []}
				handleOnClose={() => setFocusedDeathIndex(null)}
			/>
		</>
	);
}
