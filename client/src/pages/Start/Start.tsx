import SignIn from "./SignIn";

export default function Start() {
	localStorage.setItem("email", "__LOCAL__");
	return (
		<div className="mt-10 flex flex-col gap-20">
			<h1 className="m-auto text-6xl text-amber-200 underline sm:text-8xl">
				DeathLog
			</h1>
			<SignIn />
		</div>
	);
}
