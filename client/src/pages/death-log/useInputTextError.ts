import { useState, useEffect } from "react";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import {
	type StringValidtionContext,
	validateString,
	assertIsNonNull,
} from "../../utils";

export default function useInputTextError(
	inputText: string,
	context: StringValidtionContext,
) {
	const [inputTextError, setInputTextError] = useState("");
	const [displayError, setDisplayError] = useState(false); // for default edge cases: implied error with empty string during addNode FAB, but dont show text and disable confirm btn

	const tree = useDeathLogStore((state) => state.tree);
	useEffect(() => {
		const res = validateString(inputText, tree, context);

		if (!res.valid && res.cause == "empty" && context.type == "addNode") {
			assertIsNonNull(res.msg);
			setInputTextError(res.msg);
			setDisplayError(false);
		} else if (!res.valid) {
			assertIsNonNull(res.msg);
			setInputTextError(res.msg);
			setDisplayError(true);
		} else {
			setInputTextError("");
			setDisplayError(false);
		}
	}, [inputText]);
	return { inputTextError, displayError };
}
