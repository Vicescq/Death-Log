import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import useMultipleTabsWarning from "../hooks/useMultipleTabsWarning";
export default function Root() {
	useMultipleTabsWarning();
	return (
		<>
			<NavBar />
			<div className="mb-10 flex flex-col items-center justify-center gap-4 md:mt-10">
				<Outlet />
			</div>
		</>
	);
}
