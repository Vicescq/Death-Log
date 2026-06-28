import { SignedOut, SignedIn } from "@clerk/clerk-react";
import { Link } from "react-router";
import { CONSTANTS } from "../../shared/constants";
import GoogleSignIn from "../components/GoogleSignIn";

export default function Start() {
	return (
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-6xl font-bold underline sm:text-8xl">
						Death Log
					</h1>

					<div className="my-10 flex flex-col gap-4">
						<SignedOut>
							<GoogleSignIn />

							<Link to="log" className="btn btn-neutral w-full">
								{CONSTANTS.START.GUEST_BTN}
							</Link>
						</SignedOut>

						<SignedIn>
							<Link to="log">
								<button className="btn btn-neutral w-full">
									Continue
								</button>
							</Link>
							<Link
								to="user-settings"
								className="btn btn-neutral w-full"
							>
								User Settings
							</Link>
						</SignedIn>
						<Link to="stats" className="btn btn-neutral w-full">
							Statistics
						</Link>
						<Link
							to="data-management"
							className="btn btn-neutral w-full"
						>
							Manage Data
						</Link>
						<Link to="FAQ" className="btn btn-neutral w-full">
							FAQ
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
