import type { ModalProps } from "./types";

export default function Modal(props: ModalProps) {
	let css = "bg-zomp";
	if (props.modalStyle == "alert") {
		css = "rounded-3xl bg-hunyadi";
	}
	return (
		<dialog
			ref={props.modalRef}
			className={`${css} m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40`}
		>
			<div className="flex flex-col gap-2">
				{props.body}
				{props.fn ? (
					<button
						className={`${props.fn.btnCol ?? "bg-red-500"} rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]`}
						onClick={props.fn.fn}
					>
						{props.fn.label ? props.fn.label : null}
					</button>
				) : null}
				{props.fn2 ? (
					<button
						className={`${props.fn2.btnCol ?? "bg-red-500"} rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]`}
						onClick={props.fn2.fn}
					>
						{props.fn2.label ? props.fn2.label : null}
					</button>
				) : null}

				<button
					className="rounded-2xl border-4 bg-red-500 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onClick={props.closeFn.fn}
				>
					{props.closeFn.label}
				</button>
			</div>
		</dialog>
	);
}
