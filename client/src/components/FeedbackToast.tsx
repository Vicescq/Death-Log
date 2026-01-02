export default function FeedbackToast({
	msg,
	bgCSS,
	displayed,
	handleDisplay,
}: {
	msg: string;
	bgCSS: string;
	displayed: boolean;
	handleDisplay: () => void;
}) {
	return displayed ? (
		<div className="toast toast-top toast-center z-[1001]">
			<div className={`alert alert-${bgCSS}`}>
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
