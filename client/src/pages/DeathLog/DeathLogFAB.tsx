import { useRef } from "react";
import add from "../../assets/add.svg";
import fabEdit from "../../assets/fab_edit.svg";
import filter from "../../assets/filter.svg";
import sort from "../../assets/sort.svg";
import Modal from "../../components/modal/Modal";

export default function DeathLogFAB({ type }: { type: string }) {
	const modalRef = useRef<HTMLDialogElement>(null);
	return (
		<>
			<div className="fab">
				<div
					tabIndex={0}
					role="button"
					className="btn btn-lg btn-circle bg-success"
				>
					<img src={fabEdit} alt="" />
				</div>

				<div className="fab-close">
					Close
					<span className="btn btn-circle btn-lg btn-error">✕</span>
				</div>

				<div>
					Add {type}
					<button
						className="btn btn-lg btn-circle btn-success"
						onClick={() => modalRef.current?.showModal()}
					>
						<img src={add} alt="" />
					</button>
				</div>
				<div>
					Sort {type}
					<button className="btn btn-lg btn-circle btn-neutral">
						<img src={sort} alt="" />
					</button>
				</div>
				<div>
					Filter {type}
					<button className="btn btn-lg btn-circle">
						<img src={filter} alt="" />
					</button>
				</div>
			</div>
			<Modal
				ref={modalRef}
				header="Game title"
				content={
					<div className="join mt-6 w-full">
						<input
							type="text"
							placeholder="Type here"
							className="input join-item"
						/>
						<button className="btn join-item">Confirm</button>
					</div>
				}
				closeBtnName="Close"
				modalBtns={[]}
			/>
		</>
	);
}
