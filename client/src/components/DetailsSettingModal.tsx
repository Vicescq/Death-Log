type Props = {
	addItemCardModalRef: React.RefObject<HTMLDialogElement | null>;
};

export default function DetailsSettingModal({ addItemCardModalRef }: Props) {
	return (
		<dialog
			ref={addItemCardModalRef}
			className="bg-zomp m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40"
		>
			<div className="flex flex-col gap-4">
				<button
					className="bg-hunyadi rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-0"
					onClick={() => console.log("PLACE INFO LINK HERE!")}
				>
					SAVE
				</button>
				<button
					className="border- rounded-2xl border-4 bg-amber-200 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-0"
					onClick={() => addItemCardModalRef.current?.close()}
				>
					CLOSE
				</button>
			</div>
		</dialog>
	);
}
