import { Z_INDICES } from "../../shared/z-indices";

type Props = {
	msg: string;
	bgCSS: "success" | "error" | "info";
	displayed: boolean;
	onClose: () => void;
};

export type FeedbackToastState = {
	displayed: boolean;
	msg: string;
	css: "error" | "success" | "info";
};

const ALERT_CLASS = {
	success: "alert-success",
	error: "alert-error",
	info: "alert-info",
} as const;

export default function FeedbackToast({
	msg,
	bgCSS,
	displayed,
	onClose,
}: Props) {
	return displayed ? (
		<div
			className={`toast toast-top toast-center ${Z_INDICES.FEEDBACK_TOAST}`}
		>
			<div className={`alert ${ALERT_CLASS[bgCSS]}`}>
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
