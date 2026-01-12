import { useRef, useState } from "react";

export default function useCardCompletionToggle(completed: boolean) {
    const completionNotifyModalRef = useRef<HTMLDialogElement>(null);
    const [checked, setChecked] = useState(completed);
    const completedCSSStrike = completed ? "line-through" : "";
    return {completionNotifyModalRef, checked, setChecked, completedCSSStrike}
}