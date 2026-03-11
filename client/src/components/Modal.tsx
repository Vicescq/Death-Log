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
	return (
		<dialog ref={ref} className={`modal duration-0`} onClose={onClose}>
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
