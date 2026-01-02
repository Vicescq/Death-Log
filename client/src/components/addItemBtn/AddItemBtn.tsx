import { useRef } from "react";
import Modal from "../modal/Modal";

export default function AddItemBtn() {
	const modalRef = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				className="btn text-xl"
				onClick={() => modalRef.current?.showModal()}
			>
				Add game
			</button>
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
