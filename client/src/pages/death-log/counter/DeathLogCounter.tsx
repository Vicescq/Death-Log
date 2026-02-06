import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import up from "../../../assets/up.svg";
import down from "../../../assets/down.svg";
import DeathLogBreadcrumb from "../DeathLogBreadcrumb";
import NavBar from "../../../components/navBar/NavBar";
import type { Death, Subject } from "../../../model/TreeNodeModel";
import { useEffect, useRef, useState } from "react";
import { formatUTCDate, formatUTCTime, resolveTimestampUpdate } from "../utils";
import Modal from "../../../components/Modal";
import { useForm } from "react-hook-form";
import { type SubmitHandler } from "react-hook-form";
import DeathCounterModalBody from "./DeathCounterModalBody";
import { createDeath, formatString } from "../../../stores/utils";
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";
import DeathSettingsAndHistory from "./DeathSettingsAndHistory";
import { assertIsNonNull } from "../../../utils";

type Props = {
	subject: Subject;
};

export type FormDeath = Omit<
	Death,
	"parentID" | "remark" | "timestamp" | "id"
> & {
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
	const [focusedDeathID, setfocusedDeathID] = useState<null | string>(null);
	const deathHistoryRef = useRef<HTMLUListElement | null>(null);

	const sortedDeaths = subject.log.toSorted(
		(a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
	);

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
		updateNode({
			...subject,
			log: [
				...subject.log,
				createDeath(subject, remark, formData.timestampRel),
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

	const modalForm = useForm<FormDeath>({
		mode: "onChange",
	});

	const onEditDeath: SubmitHandler<FormDeath> = (formData) => {
		const formattedRemark = formatString(formData.remark);
		const remark = formattedRemark == "" ? null : formattedRemark;

		assertIsNonNull(focusedDeathID);
		const isoStr = resolveTimestampUpdate(
			modalForm,
			formData,
			focusedDeathID,
			subject,
		);

		updateNode({
			...subject,
			log: subject.log.map((death) =>
				death.id === focusedDeathID
					? createDeath(
							subject,
							remark,
							formData.timestampRel,
							isoStr,
							death.id,
						)
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
			timestampRel: death.timestampRel,
			time: formatUTCTime(death.timestamp),
			date: formatUTCDate(death.timestamp),
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

	return (
		<>
			<NavBar
				midNavContent={<></>}
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>
			<div className="m-auto mt-4 flex w-full flex-col items-center justify-center rounded-4xl sm:w-[85%] md:w-2xl">
				<h1
					className={`mx-6 w-fit rounded-2xl p-6 text-center text-4xl md:text-6xl ${subject.completed ? "text-neutral line-through" : ""}`}
				>
					{subject.name}
				</h1>
				<div className="my-4 flex flex-col gap-4">
					{!subject.completed ? (
						<button
							onClick={counterForm.handleSubmit(onIncrementDeath)}
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
						<button onClick={handleDecrementDeath}>
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
				onClose={() => {
					modalForm.reset();
					setfocusedDeathID(null);
				}}
			/>
		</>
	);
}
