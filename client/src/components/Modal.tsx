type Props = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	modalBody: React.JSX.Element;
};

export default function Modal({ modalRef, modalBody }: Props) {
	return (
		<dialog
			ref={modalRef}
			className="bg-zomp m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40"
		>
			<div className="flex flex-col gap-2">
				{modalBody}
				<button
					className="rounded-2xl border-4 bg-red-500 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onClick={() => {
						modalRef.current?.close()!;
					}}
				>
					CLOSE
				</button>
			</div>
		</dialog>
	);
}
