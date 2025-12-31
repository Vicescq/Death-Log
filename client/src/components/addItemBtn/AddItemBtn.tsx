import { useRef } from "react";
import Modal from "../modal/Modal";

export default function AddItemBtn() {
	const modalRef = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				className="btn  text-xl"
				onClick={() => modalRef.current?.showModal()}
			>
				Add game
			</button>
			<Modal ref={modalRef} />
		</>
	);
}
