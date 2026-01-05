import { Outlet } from "react-router";
import NavBar from "../components/navBar/NavBar";
import useMultipleTabsWarning from "../hooks/useMultipleTabsWarning";
import useInitApp from "../hooks/useInitApp";
import { BarLoader } from "react-spinners";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";

export default function Root() {
	useInitApp();
	const tree = useDeathLogStore((state) => state.tree);
	useMultipleTabsWarning();
	useConsoleLogOnStateChange(tree, "TREE:", tree);

	return <Outlet />;
}
