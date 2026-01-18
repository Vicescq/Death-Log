import { useNavigate } from "react-router";
import { CONSTANTS } from "../../shared/constants";

export default function ErrorPage({
	error,
	resetErrorBoundary,
}: {
	error: Error;
	resetErrorBoundary?: any;
}) {
	let navigate = useNavigate();
	const msg = resetErrorBoundary
		? "Something unexpected happened"
		: error.message;
	const icon = resetErrorBoundary ? "(ಠ_ಠ)" : "(˃̣̣̥﹏˂̣̣̥)";
	return (
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold">{icon}</h1>
					<button
						className="btn btn-accent mt-12"
						onClick={() =>
							resetErrorBoundary
								? resetErrorBoundary()
								: navigate("/")
						}
					>
						{CONSTANTS.ERROR.HOME}
					</button>
					<div className="divider"></div>
					<p className="text-xl sm:text-3xl">{msg}</p>
				</div>
			</div>
		</div>
	);
}
