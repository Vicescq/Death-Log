type Props = {
	ref: React.RefObject<HTMLDialogElement | null>;
};

export default function Modal({ ref }: Props) {
	return (
		<dialog ref={ref} className="modal">
			<div className="modal-box max-w-96">
				<form method="dialog">
					{/* if there is a button in form, it will close the modal */}
					<button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
						✕
					</button>
				</form>
				<h3 className="text-lg font-bold">Game title</h3>
				<div className="join mt-6 w-full">
					<input
						type="text"
						placeholder="Type here"
						className="input join-item"
					/>
					<button className="btn join-item">Confirm</button>
				</div>
			</div>
		</dialog>
	);
}
