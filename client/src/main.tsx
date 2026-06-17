import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage.tsx";
import Start from "./pages/Start.tsx";
import DataManagement from "./pages/data-management/DataManagement.tsx";
import MultipleTabs from "./pages/MultipleTabs.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import DeathLog from "./pages/death-log/DeathLog.tsx";
import FAQ from "./pages/FAQ.tsx";
import { useDeathLogStore } from "./stores/useDeathLogStore.ts";
import useInitApp from "./hooks/useInitApp.ts";
import useConsoleLogOnStateChange from "./hooks/useConsoleLogOnStateChange.ts";
import useMultipleTabsWarning from "./hooks/useMultipleTabsWarning.ts";
import { CONSTANTS } from "../shared/constants.ts";
import DeathLogRouter from "./pages/death-log/DeathLogRouter.tsx";
import StatsDashboard from "./pages/stats/layout/StatsDashboard.tsx";
import StatsOverview from "./pages/stats/layout/StatsOverview.tsx";
import StatsManage from "./pages/stats/layout/StatsManage.tsx";

function ThrowError(): never {
	throw new Error("Deliberate test error from /throw route");
}

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

function AppRoot() {
	const location = useLocation();
	const tree = useDeathLogStore((state) => state.tree);
	useMultipleTabsWarning();
	useConsoleLogOnStateChange(tree, "TREE:", tree);
	const status = useDeathLogStore((state) => state.status);
	const loadError = useDeathLogStore((state) => state.loadError);
	const root = useDeathLogStore((state) => state.tree.get("ROOT_NODE"));
	useInitApp();
	
	if (status === "error") {
		return (
			<ErrorBoundary
				FallbackComponent={ErrorPage}
				resetKeys={[location.pathname]}
			>
				<Routes>
					<Route path="/" element={<Start />} />
					<Route
						path="data-management"
						element={<DataManagement />}
					/>
					<Route
						path="*"
						element={
							<ErrorPage
								error={
									loadError ??
									new Error("Failed to load your data.")
								}
							/>
						}
					/>
				</Routes>
			</ErrorBoundary>
		);
	}

	if (!root) {
		return <></>;
	}

	return (
		<ErrorBoundary
			FallbackComponent={ErrorPage}
			resetKeys={[location.pathname]}
		>
			<Routes>
				<Route path="/" element={<Start />} />

				<Route path="log">
					<Route index element={<DeathLog parent={root} />} />
					<Route path=":id" element={<DeathLogRouter />} />
				</Route>

				<Route path="stats" element={<StatsDashboard />}>
					<Route index element={<StatsOverview />} />
					<Route path="build" element={<div>sdas</div>} />
					<Route path="manage" element={<StatsManage />} />
				</Route>

				<Route path="data-management" element={<DataManagement />} />

				<Route path="throw" element={<ThrowError />} />

				<Route path="FAQ" element={<FAQ />} />

				<Route
					path="*"
					element={
						<ErrorPage error={new Error(CONSTANTS.ERROR.URL)} />
					}
				/>

				<Route path="/__MULTIPLE_TABS__" element={<MultipleTabs />} />
			</Routes>
		</ErrorBoundary>
	);
}
