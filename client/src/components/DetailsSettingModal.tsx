export default function DetailsSettingModal({
	addItemCardModalRef,
}: {
	addItemCardModalRef: React.RefObject<HTMLDialogElement | null>;
}) {
	return (
		<dialog
			ref={addItemCardModalRef}
			className="bg-zomp m-auto border-4 border-black p-10 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop-blur-3xl"
		>
			<div className="flex flex-col gap-8">
				<div>
					<span className="mr-auto">ENTER NAME</span>
					<input
						type="text"
						className="rounded-xl border-4 bg-amber-200"
					/>
				</div>
				<button
					className="border- rounded-2xl border-4 bg-amber-200 p-2 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] outline-0 hover:shadow-[8px_5px_0px_rgba(0,0,0,1)]"
					onClick={() => addItemCardModalRef.current?.close()}
				>
					CLOSE
				</button>
			</div>
		</dialog>
	);
}
