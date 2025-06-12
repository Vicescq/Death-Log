import Register from "../components/Register";
import SignIn from "../components/SignIn";

export default function AuthPage() {
	return (
		<div className="m-auto flex flex-col gap-10">
			<Register />
			<SignIn />
		</div>
	);
}
