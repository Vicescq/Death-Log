import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import { useTreeStore } from "../hooks/StateManager/useTreeStore";
import { useEffect } from "react";

export default function Root() {
	
	return (
		<>
			<NavBar />
			<div className="mb-10 flex flex-col items-center justify-center gap-4 md:mt-10">
				<Outlet />
			</div>
		</>
	);
}
