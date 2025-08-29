import { useRef, useState } from "react";
import type { AICSubjectOverrides } from "../components/addItemCard/types";

type ModalState = AICSubjectOverrides | string;

export default function useModal(modalStateInit: ModalState) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [modalState, setModalState] = useState<ModalState>(modalStateInit);

	return { modalRef, modalState, setModalState };
}
