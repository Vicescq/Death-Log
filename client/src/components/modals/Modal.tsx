type Props = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	listItems: React.JSX.Element[];
	utilityBtns: React.JSX.Element[];
};

export default function Modal({ modalRef, listItems, utilityBtns }: Props) {
	return (
		<dialog
			ref={modalRef}
			className="bg-zomp m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40"
		>
			<div className="flex flex-col gap-2">
				<ul className="flex flex-col">{listItems}</ul>
				{utilityBtns}

				<button
					className="border- rounded-2xl border-4 bg-amber-200 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-0"
					onClick={() => modalRef.current?.close()}
				>
					CLOSE
				</button>
			</div>
		</dialog>
	);
}
