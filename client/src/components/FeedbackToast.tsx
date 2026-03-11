type Props = {
	msg: string;
	bgCSS: "success" | "error";
	displayed: boolean;
	onClose: () => void;
};

export default function FeedbackToast({
	msg,
	bgCSS,
	displayed,
	onClose,
}: Props) {
	return displayed ? (
		<div className="toast toast-top toast-center z-[1001]">
			<div
				className={`alert ${bgCSS == "success" ? "alert-success" : "alert-error"}`}
			>
				<button
					className="btn btn-xs btn-ghost btn-circle"
					onClick={() => onClose()}
				>
					✕
				</button>
				<span className="w-full">{msg}</span>
			</div>
		</div>
	) : null;
}
