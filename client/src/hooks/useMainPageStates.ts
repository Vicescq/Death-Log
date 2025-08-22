import { useRef, useState } from "react";

export default function useMainPageStates() {
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const [alert, setAlert] = useState("");
    return {modalRef, alert, setAlert};
}