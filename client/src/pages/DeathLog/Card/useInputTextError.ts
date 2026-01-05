import { useState, useEffect } from "react";

export default function useInputTextError(inputText: string) {
    const [inputTextError, setInputTextError] = useState("");
    const [inputTextErrorIsDisplayed, setInputTextErrorIsDisplayed] =
        useState(false);
    useEffect(() => {
        if (inputText == "") {
            setInputTextErrorIsDisplayed(false);
        }
    }, [inputText]);

    return { inputTextError, setInputTextError, inputTextErrorIsDisplayed, setInputTextErrorIsDisplayed }
}