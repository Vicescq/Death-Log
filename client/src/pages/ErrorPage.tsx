import NavBar from "../components/NavBar";

export default function ErrorPage({
	error,
	resetErrorBoundary,
}: {
	error: Error;
	resetErrorBoundary: any;
}) {
	return (
		<>
			<NavBar />
			<div className="flex min-h-[65vh] flex-col items-center justify-center gap-10 text-3xl">
				<span className="mb-5 text-6xl">(˃̣̣̥﹏˂̣̣̥)</span>
				<button
					onClick={() => resetErrorBoundary()}
					className="mb-12 rounded-2xl border-2 border-black bg-red-500 p-2 font-bold shadow-[5px_5px_0px_rgba(0,0,0,1)]"
				>
					Click me to go back home!
				</button>
				<p className="max-w-3xl">{error.message}</p>
			</div>
		</>
	);
}

export function ForceError({ msg }: { msg: string }) {
	throw new Error(msg);
	return <></>;
}
