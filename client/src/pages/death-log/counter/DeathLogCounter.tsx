import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import up from "../../../assets/up.svg";
import down from "../../../assets/down.svg";
import DeathLogBreadcrumb from "../breadcrumb/DeathLogBreadcrumb";
import { useRef, useState } from "react";
import { isoToDateSTD, isoToTimeSTD } from "../../../utils/date";
import { resolveTimestampUpdate } from "../../../utils/date";
import Modal from "../../../components/Modal";
import { useForm } from "react-hook-form";
import { type SubmitHandler } from "react-hook-form";
import DeathCounterModalBody from "./DeathCounterModalBody";
import { createDeath } from "../../../stores/utils";
import DeathSettingsAndHistory from "./DeathSettingsAndHistory";
import { assertIsNonNull } from "../../../utils/asserts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	DeathCounterFormSchema,
	EditDeathFormSchema,
	type DeathCounterForm,
	type EditDeathForm,
} from "./schema";
import NavBar from "../../../components/nav-bar/NavBar";
import type { Subject } from "../../../model/tree-node-model/SubjectSchema";
import useNotifyDateReset from "../../../hooks/useNotifyDateReset";
import Container from "../../../components/Container";

type Props = {
	subject: Subject;
};

export default function DeathLogCounter({ subject }: Props) {
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const modalRef = useRef<HTMLDialogElement>(null);
	const [modalBodyType, setModalBodyType] = useState<"edit" | "delete">(
		"edit",
	);
	const [focusedDeathID, setfocusedDeathID] = useState<null | string>(null);
	const deathHistoryRef = useRef<HTMLUListElement | null>(null);

	const sortedDeaths = subject.log.toSorted(
		(a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
	);

	const { timeNotice, onResetNotice, onTimeNoticeChange } =
		useNotifyDateReset();

	const counterForm = useForm<DeathCounterForm>({
		mode: "onChange",
		defaultValues: {
			remark: "",
			timestampRel: "T",
		},
		resolver: zodResolver(DeathCounterFormSchema),
	});

	const onIncrementDeath: SubmitHandler<DeathCounterForm> = (formData) => {
		const remark = formData.remark == "" ? null : formData.remark;
		const timestampRel = formData.timestampRel == "T" ? true : false;
		updateNode({
			...subject,
			log: [...subject.log, createDeath(subject, remark, timestampRel)],
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
			const delID = sortedDeaths[0].id;
			updateNode({
				...subject,
				log: subject.log.filter((death) => death.id != delID),
			});
		}
		counterForm.reset();
		deathHistoryRef.current?.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	}

	const modalForm = useForm<EditDeathForm>({
		mode: "onChange",
		resolver: zodResolver(EditDeathFormSchema),
	});

	const onEditDeath: SubmitHandler<EditDeathForm> = (formData) => {
		const remark = formData.remark == "" ? null : formData.remark;
		const timestampRel = formData.timestampRel == "T" ? true : false;

		assertIsNonNull(focusedDeathID);
		const focusedDeath = subject.log.find(
			(death) => death.id == focusedDeathID,
		);
		assertIsNonNull(focusedDeath);
		const isoStr = resolveTimestampUpdate(
			formData.date,
			Boolean(modalForm.formState.dirtyFields.date),
			formData.time,
			Boolean(modalForm.formState.dirtyFields.time),
			focusedDeath.timestamp,
		);

		updateNode({
			...subject,
			log: subject.log.map((death) =>
				death.id === focusedDeathID
					? {
							...death,
							remark: remark,
							timestamp: isoStr,
							timestampRel: timestampRel,
						}
					: death,
			),
		});

		modalRef.current?.close();
	};

	function handleFocusDeath(id: string) {
		setModalBodyType("edit");
		setfocusedDeathID(id);
		const death = subject.log.find((death) => death.id == id);
		assertIsNonNull(death);
		modalForm.reset({
			remark: death.remark == null ? "" : death.remark,
			timestampRel: death.timestampRel ? "T" : "F",
			time: isoToTimeSTD(death.timestamp),
			date: isoToDateSTD(death.timestamp),
		});
		modalRef.current?.showModal();
	}

	function handleDeleteDeath() {
		updateNode({
			...subject,
			log: subject.log.filter((death) => death.id != focusedDeathID),
		});
		modalRef.current?.close();
	}

	function handleDeleteDeathConfirm(id: string) {
		setModalBodyType("delete");
		setfocusedDeathID(id);
		modalRef.current?.showModal();
	}

	console.log(counterForm.formState.errors);

	return (
		<>
			<NavBar
				midNavContent={<></>}
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>
			<Container>
				<h1
					className={`my-6 text-center text-4xl font-bold break-words ${subject.completed ? "text-neutral line-through" : ""}`}
				>
					{subject.name}
				</h1>
				<div className="my-4 flex flex-col gap-4">
					{!subject.completed ? (
						<button
							onClick={counterForm.handleSubmit(onIncrementDeath)}
							className="btn btn-ghost m-auto w-fit rounded-xl"
						>
							<img src={up} className="m-auto w-8" />
						</button>
					) : null}

					<span
						className={`text-center text-6xl ${subject.completed ? "text-success" : ""}`}
					>
						{subject.log.length}
					</span>

					{!subject.completed ? (
						<button
							onClick={handleDecrementDeath}
							className="btn btn-ghost m-auto w-fit rounded-xl"
						>
							<img src={down} className="m-auto w-8" />
						</button>
					) : null}
				</div>
				<DeathSettingsAndHistory
					deathHistoryRef={deathHistoryRef}
					form={counterForm}
					subject={subject}
					onFocusDeath={(id) => handleFocusDeath(id)}
					onDeleteDeathConfirm={(id) => handleDeleteDeathConfirm(id)}
					sortedDeaths={sortedDeaths}
					focusedDeathID={focusedDeathID}
				/>
			</Container>

			<Modal
				ref={modalRef}
				content={
					<DeathCounterModalBody
						type={modalBodyType}
						form={modalForm}
						onEditDeath={onEditDeath}
						onDeleteDeath={handleDeleteDeath}
						timeNotice={timeNotice}
						onTimeNoticeChange={onTimeNoticeChange}
						onResetNotice={onResetNotice}
					/>
				}
				closeBtnName="Cancel"
				header={
					modalBodyType == "edit"
						? "Edit Death Entry"
						: "Delete this death?"
				}
				modalBtns={[]}
				onClose={() => {
					modalForm.reset();
					setfocusedDeathID(null);
				}}
			/>
		</>
	);
}
