import useModal from "../modal/useModal";

export default function useAICModals() {
    const {
        modalRef: aicModalRef,
        modalState: aicModalState,
        setModalState: setAICModalState,
    } = useModal({
        reoccurring: false,
        context: "boss",
    });

    const {
        modalRef: alertModalRef,
        modalState: alertModalState,
        setModalState: setAlertModalState,
    } = useModal("");

    return {
        aic: {
            ref: aicModalRef, state: aicModalState, set: setAICModalState
        },
        alert: {
            ref: alertModalRef, state: alertModalState, set: setAlertModalState
        }
    } as const
}