import React from "react";

export type ModalBtn = {
	text: string;
	fn: () => void;
	css: string;
	disabled: boolean; // for edge case: btn-disabled class works, but keyboard still can be active
};

type Props = {
	ref: React.RefObject<HTMLDialogElement | null>;
	header: string;
	content: React.JSX.Element;
	closeBtnName: string;
	modalBtns: ModalBtn[];
	onClose?: () => void;
	css?: string;
};

export default function Modal({
	ref,
	header,
	content,
	closeBtnName,
	modalBtns,
	onClose,
	css,
}: Props) {
	return (
		<dialog ref={ref} className={`modal ${css ?? ""}`} onClose={onClose}>
			<div className="modal-box max-w-96">
				<h3 className="text-lg font-bold">{header}</h3>

				{content}

				{modalBtns.map((modalBtn, i) => {
					return (
						<button
							disabled={modalBtn.disabled}
							className={`btn mt-4 w-full ${modalBtn.css}`}
							onClick={modalBtn.fn}
							key={i}
						>
							{modalBtn.text}
						</button>
					);
				})}

				<form method="dialog">
					<button className="btn mt-2 w-full">{closeBtnName}</button>
				</form>
			</div>
		</dialog>
	);
}
