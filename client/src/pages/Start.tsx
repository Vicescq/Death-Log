import { SignedOut, SignInButton, SignedIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import GoogleSignInBtn from "../components/GoogleSignInBtn";

export default function Start() {
	const navigate = useNavigate();

	return (
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold underline sm:text-8xl">
						Death Log
					</h1>

					<div className="my-10 flex flex-col gap-4">
						<SignedOut>
							<SignInButton>
								<GoogleSignInBtn />
							</SignInButton>
							<button
								className="btn btn-neutral"
								onClick={() => navigate("log")}
							>
								Continue as guest
							</button>
						</SignedOut>

						<SignedIn>
							<button
								className="btn btn-neutral"
								onClick={() => navigate("log")}
							>
								Continue
							</button>
						</SignedIn>
					</div>
				</div>
			</div>
		</div>
	);
}
