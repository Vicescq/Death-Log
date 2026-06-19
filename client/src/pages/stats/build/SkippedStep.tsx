import { useNavigate } from "react-router";

export default function SkippedStep() {
	const navigate = useNavigate();
	return (
		<div className="border-base-300 bg-base-200 flex flex-col items-center gap-3 rounded-xl border p-8 text-center">
			<p className="font-semibold">You skipped a step</p>
			<p className="text-sm opacity-60">
				Complete the previous steps before continuing.
			</p>
			<button
				onClick={() => navigate("/stats/build", { replace: true })}
				className="btn btn-primary btn-sm"
			>
				Back to Start
			</button>
		</div>
	);
}
