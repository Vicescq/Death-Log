import { useState } from "react";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import type { ModalFn } from "../Modal/types";
import useModal from "../Modal/useModal";

export default function useCardModals(node: DistinctTreeNode) {
    const {
        modalRef: cardModalRef,
        modalState: cardModalState,
        setModalState: setCardModalState,
    } = useModal<DistinctTreeNode>(node);

    const {
        modalRef: cardModalAlertRef,
        modalState: cardModalAlertState,
        setModalState: setCardModalAlertState,
    } = useModal<string>("");

    // each index corresponds to closeFn, fn, and fn2
    const [modalAlertProps, setModalAlertProps] = useState<ModalFn[]>(
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
        card: { ref: cardModalRef, state: cardModalState, set: setCardModalState },
        alert: {
            ref: cardModalAlertRef, state: cardModalAlertState, set: setCardModalAlertState, props: {
                state: modalAlertProps,
                set: setModalAlertProps
            }
        }
    } as const
}