import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
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

	// const loooadd = useDelayedComponent(tree.size == 0, 600);
	// if (loooadd) {
	// 	return (
	// 		<div className="m-auto flex items-center justify-center">
	// 			<BarLoader color="#3ea38d" width={200} />
	// 		</div>
	// 	);
	// }

	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
}
