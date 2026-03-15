import type { Subject } from "../../../model/tree-node-model/SubjectSchema";
import play from "../../../assets/play.svg";
import pause from "../../../assets/pause.svg";
import reset from "../../../assets/reset.svg";
import edit from "../../../assets/edit_single.svg";
import { useRef, useState } from "react";
import useTimeTracker from "../hooks/useTimeTracker";
import Modal from "../../../components/Modal";

type Props = {
	subject: Subject;
};

export default function DLCTimeTracker({ subject }: Props) {
	const [activeMode, setActiveMode] = useState<"pause" | "play">("pause");
	const { onStartTracking, onStopTracking, onResetTracking, time } =
		useTimeTracker(subject);
	const modalRef = useRef<HTMLDialogElement>(null);

	const [modalType, setModalType] = useState<"reset" | "edit">("reset");

	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full rounded-2xl border p-4">
				<legend className="fieldset-legend">Time Tracking</legend>
				<div className="my-auto">
					<div className="flex text-[1rem]">
						Time spent
						<div className="ml-auto">
							{subject.timeSpent == null ? "N / A" : time}
						</div>
					</div>
					{!subject.completed ? (
						<div className="mt-4 flex justify-center">
							<button
								className={`btn ${activeMode == "pause" ? "btn-neutral" : ""}`}
								onClick={() => {
									setActiveMode("pause");
									onStopTracking();
								}}
							>
								<img src={pause} alt="" />
							</button>
							<button
								className={`btn ${activeMode == "play" ? "btn-neutral" : ""}`}
								onClick={() => {
									setActiveMode("play");
									onStartTracking();
								}}
							>
								<img src={play} alt="" />
							</button>
							<div className="divider divider-horizontal m-0.5" />
							<button
								className="btn"
								onClick={() => {
									modalRef.current?.showModal();
								}}
							>
								<img src={reset} alt="" />
							</button>
							<button className="btn" onClick={() => 1}>
								<img src={edit} alt="" />
							</button>
						</div>
					) : null}
				</div>
			</fieldset>
			<Modal
				header="Confirm Reset"
				content={
					<>
						<div className="my-4">
							Do you want to reset your current time?
						</div>
						<button
							className="btn btn-error w-full"
							onClick={() => {
								onResetTracking();
								setActiveMode("pause");
								modalRef.current?.close();
							}}
						>
							Reset
						</button>
					</>
				}
				closeBtnName="Cancel"
				ref={modalRef}
			/>
		</>
	);
}
