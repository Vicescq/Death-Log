import { useState } from "react";

export default function Register() {
    // dont forget to validate inputs

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	return (
		<form >
			<span>Register: </span>
			<input
				type="text"
				placeholder="email"
				className="border-2"
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="text"
				placeholder="password"
				className="border-2"
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button className="rounded-2xl border-4" onClick={() => console.log(email, password, 1)}>
				SUBMIT
			</button>
		</form>
	);
}
