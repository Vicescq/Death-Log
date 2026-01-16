import { useState } from "react";
import { validateString, type ValidationContext } from "../../stores/utils";

export type ModalInputTextErrorCB = () => void;

export default function useModalInputTextError(context: ValidationContext) {
	const [inputTextError, setInputTextError] = useState("");
	function onNameEdit(currName: string) {
		const res = validateString(currName, context);

		if (context.type == "nodeAdd") {
			if (!res.valid && res.cause != "empty" && res.msg) {
				setInputTextError(res.msg);
			} else if (res.cause == "empty") {
				setInputTextError("");
			} else {
				setInputTextError("");
			}
		} else if (context.type == "nodeEdit") {
			if (!res.valid && res.cause != "nonunique" && res.msg) {
				setInputTextError(res.msg);
			} else if (res.cause == "nonunique") {
				setInputTextError("");
			} else {
				setInputTextError("");
			}
		}
	}
	return { inputTextError, onNameEdit };
}
