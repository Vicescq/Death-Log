import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import useMultipleTabsWarning from "../hooks/useMultipleTabsWarning";
import useInitApp from "../hooks/useInitApp";

export default function Root() {
	useInitApp();
	useMultipleTabsWarning();
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
}
