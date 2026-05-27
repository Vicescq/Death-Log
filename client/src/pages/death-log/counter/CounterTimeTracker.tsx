import type { Subject } from "../../../model/tree-node-model/SubjectSchema";
import play from "../../../assets/play.svg";
import pause from "../../../assets/pause.svg";
import reset from "../../../assets/reset.svg";
import { useRef, useState } from "react";
import useTimeTracker from "../hooks/useTimeTracker";
import Modal from "../../../components/Modal";

type Props = {
	subject: Subject;
};

export default function CounterTimeTracker({ subject }: Props) {
	const [activeMode, setActiveMode] = useState<"pause" | "play">("pause");
	const {
		onStartTracking,
		onStopTracking,
		onResetTracking,
		formattedTime,
		isTracking,
	} = useTimeTracker(subject);
	const modalRef = useRef<HTMLDialogElement>(null);

	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full rounded-2xl border p-4">
				<legend className="fieldset-legend">Time Tracking</legend>
				<div className="my-auto flex flex-col text-[1rem]">
					<div className={`flex ${isTracking ? "text-success" : ""}`}>
						Time spent
						<div className="ml-auto">{formattedTime}</div>
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
								<img src={pause} alt="Pause Timer" />
							</button>
							<button
								className={`btn ${activeMode == "play" ? "btn-neutral" : ""}`}
								onClick={() => {
									setActiveMode("play");
									onStartTracking();
								}}
							>
								<img src={play} alt="Start Timer" />
							</button>
							<div className="divider divider-horizontal m-0.5" />
							<button
								className="btn"
								onClick={() => {
									modalRef.current?.showModal();
								}}
							>
								<img src={reset} alt="Reset Timer" />
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
