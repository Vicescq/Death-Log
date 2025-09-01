import type { ReactNode } from "react";
import type React from "react";
import type { AICSubjectOverrides } from "../AddItemCard/types";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";

export type ModalState = AICSubjectOverrides | DistinctTreeNode | string

export type ModalLabel = "CANCEL" |
	"CLOSE" |
	"DELETE" |
	"RESET" |
	"EXIT" |
	"GO BACK" |
	"TRY AGAIN" |
	"SAVE" |
	"CONFIRM";
	
export type ModalStyle = "alert" | "utility";

export type ModalFn = {
	fn: () => void;
	label: ModalLabel;
	btnCol?: string;
};

export type ModalProps = {
	modalStyle: ModalStyle;
	body: ReactNode;
	modalRef: React.RefObject<HTMLDialogElement | null>;
	closeFn: ModalFn;
	fn?: ModalFn;
	fn2?: ModalFn;
};
