import React from "react";

export type ModalBtn = {
	text: string;
	fn: () => void;
	css: string;
};

type Props = {
	ref: React.RefObject<HTMLDialogElement | null>;
	header: string;
	content: React.JSX.Element;
	closeBtnName: string;
	modalBtns: ModalBtn[];
	handleOnClose?: () => void;
};

export default function Modal({
	ref,
	header,
	content,
	closeBtnName,
	modalBtns,
	handleOnClose
}: Props) {
	return (
		<>
			<dialog ref={ref} className="modal" onClose={handleOnClose}>
				<div className="modal-box max-w-96">
					<h3 className="text-lg font-bold">{header}</h3>

					{content}

					{modalBtns.map((modalBtn) => {
						return (
							<button
								className={`btn w-full mt-4 ${modalBtn.css}`}
								onClick={modalBtn.fn}
							>
								{modalBtn.text}
							</button>
						);
					})}

					<form method="dialog">
						<button className="btn mt-2 w-full">
							{closeBtnName}
						</button>
					</form>
				</div>
			</dialog>
		</>
	);
}
