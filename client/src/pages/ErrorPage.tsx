import { useNavigate } from "react-router";

export default function ErrorPage({
	error,
	resetErrorBoundary,
}: {
	error: Error;
	resetErrorBoundary?: any;
}) {
	let navigate = useNavigate();
	const msg = resetErrorBoundary ? "Something unexpected happened" : error.message;
	return (
		<>
			<div className="flex min-h-[65vh] flex-col items-center justify-center gap-10 text-2xl">
				<span className="mb-5 text-6xl">(˃̣̣̥﹏˂̣̣̥)</span>
				<button
					onClick={() => resetErrorBoundary ? resetErrorBoundary() : navigate("/")}
					className="mb-12 rounded-2xl border-4 border-black bg-red-500 p-2 font-bold shadow-[6px_6px_0px_rgba(0,0,0,1)]"
				>
					Click me to go back home!
				</button>
				<p className="max-w-3xl">{msg}</p>
			</div>
		</>
	);
}
