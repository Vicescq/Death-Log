import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import up from "../../../assets/up.svg";
import down from "../../../assets/down.svg";
import DeathLogBreadcrumb from "../DeathLogBreadcrumb";
import NavBar from "../../../components/navBar/NavBar";
import type { Death, Subject } from "../../../model/TreeNodeModel";
import { createDeath, formatString } from "../../../stores/utils";
import { useRef, useState } from "react";
import { formatUTCDate, formatUTCTime } from "../utils";
import Modal from "../../../components/Modal";
import TooltipButton from "../../../components/TooltipButton";
import { CONSTANTS } from "../../../../shared/constants";
import edit from "../../../assets/edit_single.svg";
import { useForm } from "react-hook-form";
import { type SubmitHandler } from "react-hook-form";
import DeathCounterModalBody from "./EditDeathModal";

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

	const counterForm = useForm<Death>({
		mode: "onChange",
	});

	const modalForm = useForm<Death>({
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<Death> = (data) => {
		data.remark = data.remark == "" ? null : formatString(data.remark!);
		console.log(data);
	};

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
												setModalBodyType("edit");
												modalForm.reset(subject.log[i]);

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
				content={
					<DeathCounterModalBody
						type={modalBodyType}
						register={modalForm.register}
						errors={modalForm.formState.errors}
						onSubmit={onSubmit}
						handleSubmit={modalForm.handleSubmit}
						isValid={modalForm.formState.isValid}
					/>
				}
				closeBtnName="Cancel"
				header={
					modalBodyType == "edit"
						? "Edit Death Entry"
						: "Delete this death?"
				}
				modalBtns={[]}
				handleOnClose={() => modalForm.reset()}
			/>
		</>
	);
}
