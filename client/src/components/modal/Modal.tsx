<<<<<<< HEAD
import type { ModalProps } from "./types";

export default function Modal(props: ModalProps) {
=======
import type React from "react";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import type { AICSubjectOverrides } from "../addItemCard/types";

export type ModalState = AICSubjectOverrides | DistinctTreeNode | string;
export type AlertModalState = string;
export type ModalLabel =
	| "CANCEL"
	| "CLOSE"
	| "DELETE"
	| "RESET"
	| "EXIT"
	| "GO BACK"
	| "TRY AGAIN"
	| "SAVE"
	| "CONFIRM";
export type ModalStyle = "alert" | "utility";
export type ModalPropsState = Omit<Props, "modalRef" | "body">;

export type ModalFn = {
	fn: () => void;
	label: ModalLabel;
	btnCol?: string;
};

type Props = {
	modalStyle: ModalStyle;
	body: React.JSX.Element;
	modalRef: React.RefObject<HTMLDialogElement | null>;
	modalFn: ModalFn;
	modalFn2?: ModalFn;
	modalFn3?: ModalFn;
};

export default function Modal(props: Props) {
>>>>>>> 8d11761659a3b49db77889a688e87671fd3d4fb4
	let css = "bg-zomp";
	if (props.modalStyle == "alert") {
		css = "rounded-3xl bg-hunyadi";
	}
<<<<<<< HEAD

=======
	
>>>>>>> 8d11761659a3b49db77889a688e87671fd3d4fb4
	return (
		<dialog
			ref={props.modalRef}
			className={`${css} m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40`}
		>
			<div className="flex flex-col gap-2">
				{props.body}
<<<<<<< HEAD
				{props.fn ? (
					<button
						className={`${props.fn.btnCol ?? "bg-red-500"} rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]`}
						onClick={props.fn.fn}
					>
						{props.fn.label ? props.fn.label : null}
					</button>
				) : null}
				{props.fn2 ? (
					<button
						className={`${props.fn2.btnCol ?? "bg-red-500"} rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]`}
						onClick={props.fn2.fn}
					>
						{props.fn2.label ? props.fn2.label : null}
=======
				{props.modalFn2 ? (
					<button
						className={`${props.modalFn2.btnCol ?? "bg-red-500"} rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]`}
						onClick={props.modalFn2.fn}
					>
						{props.modalFn2.label}
					</button>
				) : null}
				{props.modalFn3 ? (
					<button
						className={`${props.modalFn3.btnCol ?? "bg-red-500"} rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]`}
						onClick={props.modalFn3.fn}
					>
						{props.modalFn3.label}
>>>>>>> 8d11761659a3b49db77889a688e87671fd3d4fb4
					</button>
				) : null}

				<button
					className="rounded-2xl border-4 bg-red-500 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
<<<<<<< HEAD
					onClick={props.closeFn.fn}
				>
					{props.closeFn.label}
=======
					onClick={props.modalFn.fn}
				>
					{props.modalFn.label}
>>>>>>> 8d11761659a3b49db77889a688e87671fd3d4fb4
				</button>
			</div>
		</dialog>
	);
}
