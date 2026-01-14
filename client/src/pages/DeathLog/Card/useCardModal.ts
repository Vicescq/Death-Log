import { useState, useRef } from "react";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";

export default function useCardModal(node: DistinctTreeNode){
    const [modalState, setModalState] = useState<DistinctTreeNode>({ ...node });
	const [inputTextNameError, setInputTextNameError] = useState("");
	const editModalRef = useRef<HTMLDialogElement>(null);
    const [inputTextProfileGroupError, setInputTextProfileGroupError] = useState("");

    return {modalState, setModalState, inputTextNameError, setInputTextNameError, editModalRef, inputTextProfileGroupError, setInputTextProfileGroupError}
}