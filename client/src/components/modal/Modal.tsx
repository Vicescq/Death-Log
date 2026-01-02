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
};

export default function Modal({
	ref,
	header,
	content,
	closeBtnName,
	modalBtns,
}: Props) {
	return (
		<>
			<dialog ref={ref} className="modal">
				<div className="modal-box max-w-96">
					<h3 className="text-lg font-bold">{header}</h3>

					{content}

					{modalBtns.map((modalBtn) => {
						return (
							<button
								className={`btn w-full ${modalBtn.css}`}
								onClick={modalBtn.fn}
							>
								{modalBtn.text}
							</button>
						);
					})}

					<form method="dialog">
						<button className="btn mt-4 w-full">
							{closeBtnName}
						</button>
					</form>
				</div>
			</dialog>
		</>
	);
}
