type Props = {
	msg: string;
	bgCSS: "success" | "error";
	displayed: boolean;
	handleDisplay: () => void;
};

export default function FeedbackToast({
	msg,
	bgCSS,
	displayed,
	handleDisplay,
}: Props) {
	const css = {
		success: "alert-success",
		error: "alert-error",
	} as const;
	return displayed ? (
		<div className="toast toast-top toast-center z-[1001]">
			<div className={`alert ${css[bgCSS]}`}>
				<button
					className="btn btn-xs btn-ghost btn-circle"
					onClick={() => handleDisplay()}
				>
					✕
				</button>
				<span className="w-full">{msg}</span>
			</div>
		</div>
	) : null;
}
