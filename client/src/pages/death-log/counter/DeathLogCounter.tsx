import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import up from "../../../assets/up.svg";
import down from "../../../assets/down.svg";
import DeathLogBreadcrumb from "../DeathLogBreadcrumb";
import NavBar from "../../../components/navBar/NavBar";
import type { Death, Subject } from "../../../model/TreeNodeModel";
import { useRef, useState } from "react";
import { formatUTCDate, formatUTCTime, toUTCDate } from "../utils";
import Modal from "../../../components/Modal";
import TooltipButton from "../../../components/TooltipButton";
import { CONSTANTS } from "../../../../shared/constants";
import edit from "../../../assets/edit_single.svg";
import { Controller, useForm } from "react-hook-form";
import { type SubmitHandler } from "react-hook-form";
import DeathCounterModalBody from "./EditDeathModal";
import { createDeath } from "../../../stores/utils";
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";

type Props = {
	subject: Subject;
};

export type FormDeath = Omit<Death, "parentID" | "remark" | "timestamp"> & {
	remark: string;
	date: string;
	time: string;
};

export default function DeathLogCounter({ subject }: Props) {
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const modalRef = useRef<HTMLDialogElement>(null);
	const [modalBodyType, setModalBodyType] = useState<"edit" | "delete">(
		"edit",
	);
	const [focusedDeathIndex, setfocusedDeathIndex] = useState<null | number>(
		null,
	);

	const counterForm = useForm<FormDeath>({
		mode: "onChange",
		defaultValues: {
			remark: "",
			timestampRel: true,
		},
	});

	const onSubmitIncrementDeath: SubmitHandler<FormDeath> = (formData) => {
		const remark = formData.remark == "" ? null : formData.remark;
		updateNode(subject, {
			...subject,
			log: [
				...subject.log,
				createDeath(subject.id, remark, formData.timestampRel),
			],
		});
		counterForm.reset();
	};

	function handleDecrementDeath() {
		if (subject.log.length > 0) {
			const log = [...subject.log];
			log.pop();
			updateNode(subject, {
				...subject,
				log: log,
			});
		}
		counterForm.reset();
	}

	const modalForm = useForm<FormDeath>({
		mode: "onChange",
	});

	const onEditSubmitModal: SubmitHandler<FormDeath> = (formData) => {
		const remark = formData.remark == "" ? null : formData.remark;
		console.log(formData.time);
		const isoStr = toUTCDate(formData.date, formData.time);

		updateNode(subject, {
			...subject,
			log: subject.log.map((death, i) =>
				i === focusedDeathIndex
					? createDeath(
							subject.id,
							remark,
							formData.timestampRel,
							isoStr,
						)
					: death,
			),
		});
		modalRef.current?.close();
		console.log(formData);
	};

	function handleFocusedDeath(i: number) {
		setModalBodyType("edit");
		setfocusedDeathIndex(i);
		const death = subject.log[i];
		modalForm.reset({
			remark: death.remark == null ? "" : death.remark,
			timestampRel: death.timestampRel,
			time: formatUTCTime(death.timestamp),
			date: formatUTCDate(death.timestamp),
		});
		modalRef.current?.showModal();
	}

	function handleDeleteDeath() {
		updateNode(subject, {
			...subject,
			log: subject.log.filter((_, i) => i != focusedDeathIndex),
		});
		modalRef.current?.close();
	}

	const sortedDeaths = subject.log.toSorted(
		(a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
	);

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
					<button
						onClick={counterForm.handleSubmit(
							onSubmitIncrementDeath,
						)}
					>
						<img src={up} className="m-auto w-8" />
					</button>

					<span className={`text-center text-6xl`}>
						{subject.log.length}
					</span>

					<button onClick={handleDecrementDeath}>
						<img src={down} className="m-auto w-8" />
					</button>
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
						{...counterForm.register("remark", {
							maxLength: {
								value: CONSTANTS.DEATH_REMARK_MAX,
								message: CONSTANTS.ERROR.MAX_LENGTH,
							},
						})}
					/>
					{counterForm.formState.errors.remark && (
						<div className="text-error">
							{counterForm.formState.errors.remark.message}
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
										control={counterForm.control}
										name="timestampRel"
										render={({
											field: { onChange, value },
										}) => (
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
										control={counterForm.control}
										name="timestampRel"
										render={({
											field: { onChange, value },
										}) => (
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
											onClick={() =>
												handleFocusedDeath(i)
											}
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
												setfocusedDeathIndex(i);
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
						onSubmit={onEditSubmitModal}
						handleSubmit={modalForm.handleSubmit}
						isValid={modalForm.formState.isValid}
						control={modalForm.control}
						onDelete={handleDeleteDeath}
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
