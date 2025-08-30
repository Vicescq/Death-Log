import { useRef, useState } from "react";
import type { ModalPropsState, ModalState } from "../components/modal/Modal";

export default function useModal(
	modalStateInit: ModalState,
	modalStatePropsInit: ModalPropsState,
) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [modalState, setModalState] = useState<ModalState>(modalStateInit);
	const [modalPropsState, setModalPropsState] =
		useState<ModalPropsState>(modalStatePropsInit);

	return {
		modalRef,
		modalState,
		setModalState,
		modalPropsState,
		setModalPropsState,
	};
}
