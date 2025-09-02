import useModal from "../modal/useModal";
import type { AICSubjectOverrides } from "./types";

export default function useAICModals() {
    const {
        modalRef: aicModalRef,
        modalState: aicModalState,
        setModalState: setAICModalState,
    } = useModal<AICSubjectOverrides>({
        reoccurring: false,
        context: "boss",
    });

    const {
        modalRef: alertModalRef,
        modalState: alertModalState,
        setModalState: setAlertModalState,
    } = useModal<string>("");

    return {
        aic: {
            ref: aicModalRef, state: aicModalState, set: setAICModalState
        },
        alert: {
            ref: alertModalRef, state: alertModalState, set: setAlertModalState
        }
    } as const
}