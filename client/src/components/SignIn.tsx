import { useState } from "react";
import { auth } from "../firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import APIService from "../services/APIService";



export default function SignIn() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	
	async function handleSignIn() {
		const provider = new GoogleAuthProvider();
		try{
			const userCreds = await signInWithPopup(auth, provider);
			if (userCreds.user.email){
				APIService.signInUser(userCreds.user)
			}
			console.log(userCreds);
		}
		catch(error){
			console.error(error);
		}

	}

	return (
		<form action="#">
			<span>Signin: </span>
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
			<button
				className="rounded-2xl border-4"
				onClick={() => handleSignIn()}
			>
				SUBMIT
			</button>
		</form>
	);
}
