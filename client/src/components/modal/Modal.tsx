type WarningModal = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	modalBody: React.JSX.Element;
	type: "warning";
	handleModalClose?: () => void;
};

type WarningReconfirmModal = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	modalBody: React.JSX.Element;
	type: "warningReconfirm";
	handleModalClose?: () => void;
};

type GenericModal = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	modalBody: React.JSX.Element;
	type: "generic";
	handleModalClose?: () => void;
};

type Props = GenericModal | WarningModal | WarningReconfirmModal;

export default function Modal(props: Props) {
	let css = "bg-zomp";
	let exitBtnName = "CLOSE";
	if (props.type != "generic") {
		css = "rounded-3xl bg-orange-600";
	}
	if (props.type == "warningReconfirm") {
		exitBtnName = "CANCEL";
	}

	return (
		<dialog
			ref={props.modalRef}
			className={`${css} m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40`}
		>
			<div className="flex flex-col gap-2">
				{props.modalBody}

				<button
					className="rounded-2xl border-4 bg-red-500 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onClick={() => {
						props.modalRef.current?.close();
						if (props.handleModalClose) {
							props.handleModalClose();
						}
					}}
				>
					{exitBtnName}
				</button>
			</div>
		</dialog>
	);
}
