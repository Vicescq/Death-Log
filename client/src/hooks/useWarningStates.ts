import { useRef, useState } from "react";

export default function useWarningStates() {
    const warningModalRef = useRef<HTMLDialogElement | null>(null);
    const [warning, setWarning] = useState("");

    return { warningModalRef, warning, setWarning };
}