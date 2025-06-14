import { useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import APIService from "../services/APIService";
import IndexedDBService from "../services/IndexedDBService";
import useUserContext from "../contexts/useUserContext";
import { useNavigate } from "react-router";

export default function SignIn() {
	const navigate = useNavigate();
	const [user, setUser] = useUserContext();

	async function handleSignIn() {
		const provider = new GoogleAuthProvider();
		try {
			const userCreds = await signInWithPopup(auth, provider);
			if (userCreds.user && userCreds.user.email) {
				const token = await userCreds.user.getIdToken();
				IndexedDBService.updateCurrentUser(userCreds.user.email);
				APIService.signInUser(userCreds.user, token);
				navigate("/death-log");
			}
			console.log(userCreds);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="flex flex-col gap-4 text-black">
			{user ? (
				<button
					className="bg-indianred min-w-40 rounded-2xl border-4 border-black p-1 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
					onClick={() => navigate("/death-log")}
				>
					CONTINUE WITH {user.email}
				</button>
			) : (
				<button
					className="bg-indianred min-w-40 rounded-2xl border-4 border-black p-1 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
					onClick={() => handleSignIn()}
				>
					GOOGLE SIGN IN
				</button>
			)}

			<button
				className="bg-hunyadi min-w-40 rounded-2xl border-4 border-black p-1 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
				onClick={() => {
					// try catch here?
					// setUser("__LOCAL__");
					auth.signOut().catch((e) => console.error(e));
					IndexedDBService.updateCurrentUser("__LOCAL__");
					navigate("/death-log");
					// maybe add alertmodal warning that will alert user they will get signed out
				}}
			>
				CONTINUE AS GUEST
			</button>
		</div>
	);
}
