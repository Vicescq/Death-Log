import type React from "react";

type NegativeLabel = "CANCEL" | "CLOSE" | "DELETE";
type PositiveLabel = "GO BACK" | "TRY AGAIN" | "SAVE";
type ModalStyle = "alert" | "utility";

type Props = {
	modalStyle: ModalStyle;
	body: React.JSX.Element;
	modalRef: React.RefObject<HTMLDialogElement | null>;
	negativeFn: () => void;
	negativeFnBtnLabel: NegativeLabel;
	positiveFn?: () => void;
	positiveFnBtnLabel?: PositiveLabel;
	negativeFn2?: () => void;
	negativeFn2BtnLabel?: NegativeLabel;
};

export default function Modal(props: Props) {
	let css = "bg-zomp";
	if (props.modalStyle == "alert") {
		css = "rounded-3xl bg-orange-600";
	}

	return (
		<dialog
			ref={props.modalRef}
			className={`${css} m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40`}
		>
			<div className="flex flex-col gap-2">
				{props.body}
				{props.positiveFn ? (
					<button
						className="rounded-2xl border-4 bg-red-500 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
						onClick={props.positiveFn}
					>
						{props.positiveFnBtnLabel
							? props.positiveFnBtnLabel
							: null}
					</button>
				) : null}
				{props.negativeFn2 ? (
					<button
						className="rounded-2xl border-4 bg-red-500 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
						onClick={props.negativeFn2}
					>
						{props.negativeFn2BtnLabel
							? props.negativeFn2BtnLabel
							: null}
					</button>
				) : null}

				<button
					className="rounded-2xl border-4 bg-red-500 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onClick={props.negativeFn}
				>
					{props.negativeFnBtnLabel}
				</button>
			</div>
		</dialog>
	);
}
