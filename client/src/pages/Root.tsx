import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import useUserContext from "../contexts/useUserContext";
import Start from "./Start";
import { useEffect, useState } from "react";

export default function Root() {
	const [user, setUser] = useUserContext();
	return (
		<>
			<NavBar />
			<div className="mb-10 flex flex-col items-center justify-center gap-4 md:mt-10">
				{!user ? <Start /> : <Outlet />}
			</div>
		</>
	);
}
