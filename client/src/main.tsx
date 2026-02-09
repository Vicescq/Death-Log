import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	BrowserRouter,
	Routes,
	Route,
	useNavigate,
	Outlet,
} from "react-router";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage.tsx";
import Start from "./pages/Start.tsx";
import DataManagement from "./pages/DataManagement.tsx";
import DeathLogRouter from "./pages/death-log/DeathLogRouter.tsx";
import MultipleTabs from "./pages/MultipleTabs.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import DeathLog from "./pages/death-log/DeathLog.tsx";
import FAQ from "./pages/FAQ.tsx";
import { useDeathLogStore } from "./stores/useDeathLogStore.ts";
import useInitApp from "./hooks/useInitApp.ts";
import useConsoleLogOnStateChange from "./hooks/useConsoleLogOnStateChange.ts";
import useMultipleTabsWarning from "./hooks/useMultipleTabsWarning.ts";
import { CONSTANTS } from "../shared/constants.ts";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
			<BrowserRouter>
				<AppRoot />
			</BrowserRouter>
		</ClerkProvider>
	</StrictMode>,
);

function ErrorBoundaryTest() {
	throw new Error("testtesttesttesttesttest");
	return <></>;
}

function AppRoot() {
	let navigate = useNavigate();
	const tree = useDeathLogStore((state) => state.tree);
	useMultipleTabsWarning();
	useConsoleLogOnStateChange(tree, "TREE:", tree);
	const root = useDeathLogStore((state) => state.tree.get("ROOT_NODE"));
	useInitApp();

	if (!root) {
		// wait for app to hydrate
		return <></>;
	}

	return (
		<ErrorBoundary
			FallbackComponent={ErrorPage}
			onReset={() => navigate("/")}
		>
			<Routes>
				<Route path="/" element={<Outlet />}>
					<Route index element={<Start />} />

					<Route
						path="log"
						element={<DeathLog parent={root} key="ROOT_NODE" />}
					/>
					<Route path="log/:gameID" element={<DeathLogRouter />} />
					<Route
						path="log/:gameID/:profileID"
						element={<DeathLogRouter />}
					/>
					<Route
						path="log/:gameID/:profileID/:subjectID"
						element={<DeathLogRouter />}
					/>

					<Route
						path="data-management"
						element={<DataManagement />}
					/>

					<Route path="FAQ" element={<FAQ />} />

					<Route path="x" element={<ErrorBoundaryTest />} />

					<Route
						path="*"
						element={
							<ErrorPage error={new Error(CONSTANTS.ERROR.URL)} />
						}
					/>
				</Route>
				<Route path="/__MULTIPLE_TABS__" element={<MultipleTabs />} />
			</Routes>
		</ErrorBoundary>
	);
}
