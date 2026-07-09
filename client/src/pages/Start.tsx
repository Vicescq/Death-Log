import { Show } from "@clerk/react";
import { Link } from "react-router";
import { CONSTANTS } from "../../shared/constants";

export default function Start() {
	return (
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-6xl font-bold underline sm:text-8xl">
						Death Log
					</h1>

					<div className="my-10 flex flex-col gap-4">
						<Link to="log">
							<button className="btn btn-neutral w-full">
								{CONSTANTS.START.CONTINUE}
							</button>
						</Link>

						<Link
							to="user-settings"
							className="btn btn-neutral w-full"
						>
							User Settings | Sign In / Register
						</Link>

						<Link to="stats" className="btn btn-neutral w-full">
							Statistics
						</Link>
						<Link
							to="data-management"
							className="btn btn-neutral w-full"
						>
							Manage Data
						</Link>
						<Link to="faq" className="btn btn-neutral w-full">
							FAQ
						</Link>
						<Link to="about" className="btn btn-neutral w-full">
							About
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
