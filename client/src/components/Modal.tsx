import React from "react";

type Props = {
	ref: React.RefObject<HTMLDialogElement | null>;
	header: string;
	content: React.JSX.Element;
	closeBtnName: string;
	onClose?: () => void;
};

export default function Modal({
	ref,
	header,
	content,
	closeBtnName,
	onClose,
}: Props) {
	// css: modal duration-0 vs modal, modal for now but choose former if too delayed
	return (
		<dialog ref={ref} className={`modal`} onClose={onClose}>
			<div className="modal-box max-w-96">
				<h3 className="text-lg font-bold">{header}</h3>

				{content}

				<form method="dialog">
					<button className="btn mt-2 w-full">{closeBtnName}</button>
				</form>
			</div>
		</dialog>
	);
}
