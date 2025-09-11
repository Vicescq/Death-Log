import { useNavigate } from "react-router";

export default function Start() {
	const navigate = useNavigate();

	return (
		<div className="mt-10 flex flex-5 flex-col items-center justify-center gap-20">
			<h1 className="m-auto text-6xl text-amber-200 underline sm:text-8xl">
				DeathLog
			</h1>
			<div className="flex flex-col gap-4 text-black">
				<button
					className="bg-hunyadi min-w-40 rounded-2xl border-4 border-black p-1 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
					onClick={() => navigate("/death-log")}
				>
					CONTINUE
				</button>
			</div>
		</div>
	);
}
