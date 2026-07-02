import { SignIn } from "@clerk/react";

export default function AuthCard() {
	return (
		<div className="bg-base-200 rounded-box mb-8 flex flex-col gap-4 p-5">
			<h2 className="text-xl font-semibold">Login / Register</h2>
			<SignIn />
		</div>
	);
}
