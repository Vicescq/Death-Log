import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import up from "../../../assets/up.svg";
import down from "../../../assets/down.svg";
import DeathLogBreadcrumb from "../DeathLogBreadcrumb";
import NavBar from "../../../components/navBar/NavBar";
import type { Death, Subject } from "../../../model/TreeNodeModel";
import { useEffect, useRef, useState } from "react";
import { formatUTCDate, formatUTCTime, toUTCDate } from "../utils";
import Modal from "../../../components/Modal";
import { useForm } from "react-hook-form";
import { type SubmitHandler } from "react-hook-form";
import DeathCounterModalBody from "./DeathCounterModalBody";
import { createDeath, formatString } from "../../../stores/utils";
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";
import DeathSettingsAndHistory from "./DeathSettingsAndHistory";

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
	const deathHistoryRef = useRef<HTMLUListElement | null>(null);

	const counterForm = useForm<FormDeath>({
		mode: "onChange",
		defaultValues: {
			remark: "",
			timestampRel: true,
		},
	});

	const onIncrementDeath: SubmitHandler<FormDeath> = (formData) => {
		const formattedRemark = formatString(formData.remark);
		const remark = formattedRemark == "" ? null : formattedRemark;
		updateNode(subject, {
			...subject,
			log: [
				...subject.log,
				createDeath(subject.id, remark, formData.timestampRel),
			],
		});
		counterForm.reset();
		deathHistoryRef.current?.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
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
		deathHistoryRef.current?.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	}

	const modalForm = useForm<FormDeath>({
		mode: "onChange",
	});

	const onEditDeath: SubmitHandler<FormDeath> = (formData) => {
		const formattedRemark = formatString(formData.remark);
		const remark = formattedRemark == "" ? null : formattedRemark;
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
	};

	function handleFocusDeath(i: number) {
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

	function handleDeleteDeathConfirm(i: number) {
		setModalBodyType("delete");
		setfocusedDeathIndex(i);
		modalRef.current?.showModal();
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
						onClick={counterForm.handleSubmit(onIncrementDeath)}
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
				<DeathSettingsAndHistory
					deathHistoryRef={deathHistoryRef}
					form={counterForm}
					subject={subject}
					onFocusDeath={(i) => handleFocusDeath(i)}
					onDeleteDeathConfirm={(i) => handleDeleteDeathConfirm(i)}
				/>
			</div>
			<Modal
				ref={modalRef}
				content={
					<DeathCounterModalBody
						type={modalBodyType}
						form={modalForm}
						onEditDeath={onEditDeath}
						onDeleteDeath={handleDeleteDeath}
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
