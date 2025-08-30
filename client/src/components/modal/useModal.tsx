import { useRef, useState } from "react";
import type { ModalProps, ModalState } from "./types";

export default function useModal(modalStateInit: ModalState) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [modalState, setModalState] = useState<ModalState>(modalStateInit);

	return {
		modalRef,
		modalState,
		setModalState,
	};
}
