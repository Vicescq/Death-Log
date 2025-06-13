import { useState } from "react";
import APIService from "../services/APIService";

export default function Register() {
    // dont forget to validate inputs

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	return (
		<form >
			<span>Register: </span>
			<input
				type="text"
				placeholder="email"
				className="border-2"
				onChange={(e) => setUsername(e.target.value)}
			/>
			<input
				type="text"
				placeholder="password"
				className="border-2"
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button className="rounded-2xl border-4" onClick={() => APIService.registerUser({username: username, password: password})}>
				SUBMIT
			</button>
		</form>
	);
}
