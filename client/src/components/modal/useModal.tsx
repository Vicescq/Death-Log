import { useRef, useState } from "react";
<<<<<<< HEAD:client/src/components/modal/useModal.tsx
import type { AICSubjectOverrides } from "../addItemCard/types";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
=======
import type { ModalPropsState, ModalState } from "../components/modal/Modal";
>>>>>>> 8d11761659a3b49db77889a688e87671fd3d4fb4:client/src/hooks/useModal.tsx

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
