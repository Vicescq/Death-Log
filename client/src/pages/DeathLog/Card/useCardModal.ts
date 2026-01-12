import { useState, useRef } from "react";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";

export default function useCardModal(node: DistinctTreeNode){
    const [modalState, setModalState] = useState<DistinctTreeNode>({ ...node });
	const [inputTextError, setInputTextError] = useState("");
	const editModalRef = useRef<HTMLDialogElement>(null);

    return {modalState, setModalState, inputTextError, setInputTextError, editModalRef}
}