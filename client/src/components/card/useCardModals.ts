import { useState } from "react";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import type { ModalFn, ModalProps } from "../modal/types";
import useModal from "../modal/useModal";

export default function useCardModals(node: DistinctTreeNode) {
    const {
        modalRef: cardModalRef,
        modalState: cardModalState,
        setModalState: setCardModalState,
    } = useModal(node);

    const {
        modalRef: cardModalConfirmRef,
        modalState: cardModalConfirmState,
        setModalState: setCardModalConfirmState,
    } = useModal("");

    const {
        modalRef: cardModalAlertRef,
        modalState: cardModalAlertState,
        setModalState: setCardModalAlertState,
    } = useModal("");

    // each index corresponds to closeFn, fn, and fn2
    const [modalConfirmProps, setModalConfirmProps] = useState<ModalFn[]>(
        [{
            fn: () => { }, label: "CLOSE", btnCol: ""
        },
        {
            fn: () => { }, label: "CLOSE", btnCol: ""
        },
        {
            fn: () => { }, label: "CLOSE", btnCol: ""
        }]
    );

    return {
        card: { ref: cardModalRef, state: cardModalState, set: setCardModalState }, confirm: {
            ref: cardModalConfirmRef, state: cardModalConfirmState, set: setCardModalConfirmState, props: {
                state: modalConfirmProps, set: setModalConfirmProps
            }
        }, alert: { ref: cardModalAlertRef, state: cardModalAlertState, set: setCardModalAlertState }
    } as const
}