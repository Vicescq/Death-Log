import GoogleSignIn from "../../components/GoogleSignIn";

export default function SignInCard() {
	return (
		<div className="bg-base-200 rounded-box mb-8 flex flex-col gap-4 p-5">
			<div>
				<h2 className="text-xl font-semibold">Create an account</h2>
				<p className="mt-1 text-sm opacity-70">
					Sign in with Google to register an account, share your stats
					on a public profile, and follow other players.
				</p>
			</div>
			<GoogleSignIn />
		</div>
	);
}
