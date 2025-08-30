import { useRef, useState } from "react";
import type { ModalProps, ModalState } from "./types";

export default function useModal(
	modalStateInit: ModalState,
	modalStatePropsInit: ModalProps,
) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [modalState, setModalState] = useState<ModalState>(modalStateInit);
	const [modalPropsState, setModalPropsState] =
		useState<ModalProps>(modalStatePropsInit);

	return {
		modalRef,
		modalState,
		setModalState,
		modalPropsState,
		setModalPropsState,
	};
}
