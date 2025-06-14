import { useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import APIService from "../services/APIService";
import IndexedDBService from "../services/IndexedDBService";
import useUserContext from "../contexts/useUserContext";

export default function SignIn() {
	const [user, setUser] = useUserContext();
	async function handleSignIn() {
		const provider = new GoogleAuthProvider();
		try {
			const userCreds = await signInWithPopup(auth, provider);
			if (userCreds.user && userCreds.user.email) {
				const token = await userCreds.user.getIdToken();
				IndexedDBService.updateCurrentUser(userCreds.user.email);
				APIService.signInUser(userCreds.user, token);
			}
			console.log(userCreds);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="flex flex-col gap-4 text-black">
			<button
				className="bg-indianred min-w-40 rounded-2xl border-4 border-black p-1 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
				onClick={() => handleSignIn()}
			>
				GOOGLE SIGN IN
			</button>
			<button
				className="bg-hunyadi min-w-40 rounded-2xl border-4 border-black p-1 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
				onClick={() => {
					setUser("__LOCAL__");
				}}
			>
				CONTINUE AS GUEST
			</button>
		</div>
	);
}
