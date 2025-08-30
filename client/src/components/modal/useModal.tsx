import { useRef, useState } from "react";
import type { ModalState } from "./types";

export default function useModal<T extends ModalState>(modalStateInit: T) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [modalState, setModalState] = useState(modalStateInit);

	return {
		modalRef,
		modalState,
		setModalState,
	};
}
