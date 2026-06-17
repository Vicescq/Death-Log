import { useState } from "react";
import { useNavigate } from "react-router";
import { CONSTANTS } from "../../shared/constants";

export default function ErrorPage({ error }: { error: Error }) {
	const navigate = useNavigate();

	// picked once per mount — a 50/50 coin flip, stable across re-renders
	const ICONS = ["(ಠ_ಠ)", "(˃̣̣̥﹏˂̣̣̥)"];
	const [icon] = useState(
		() => ICONS[Math.floor(Math.random() * ICONS.length)],
	);
	const msg = error.message || "Something unexpected happened";

	return (
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold">{icon}</h1>
					<div className="mt-12 flex flex-col justify-center gap-3">
						<button
							className="btn btn-accent"
							onClick={() => navigate("/")}
						>
							{CONSTANTS.ERROR.HOME}
						</button>
						<button
							className="btn btn-info"
							onClick={() => navigate("/data-management")}
						>
							Data Management
						</button>
					</div>
					<div className="divider"></div>
					<div className="text-xl">An error occured!</div>
					<div className="divider"></div>
					<div className="mockup-code w-full text-left">
						<pre data-prefix="✗" className="text-error">
							<code>{msg}</code>
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
