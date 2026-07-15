import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage.tsx";
import Start from "./pages/Start.tsx";
import DataManagement from "./pages/data-management/DataManagement.tsx";
import { ClerkProvider } from "@clerk/react";
import DeathLog from "./pages/death-log/DeathLog.tsx";
import FAQ from "./pages/faq/FAQ.tsx";
import About from "./pages/about/About.tsx";
import UserSettings from "./pages/user-settings/UserSettings.tsx";
import { useDeathLogStore } from "./stores/useDeathLogStore.ts";
import useInitApp from "./hooks/useInitApp.ts";
import useMultitabSync from "./hooks/useMultitabSync.ts";
import { CONSTANTS } from "../shared/constants.ts";
import DeathLogRouter from "./pages/death-log/DeathLogRouter.tsx";
import Spinner from "./components/Spinner.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HEALTH_QUERY_KEY, healthQueryFn } from "./services/healthQuery.ts";
import Banners from "./components/Banners.tsx";
import useDebug from "./hooks/useDebug.ts";
import { DebugService } from "./services/DebugService.ts";

const StatsDashboard = lazy(
	() => import("./pages/stats/layout/dashboard/StatsDashboard.tsx"),
);
const ChartGrid = lazy(() => import("./pages/stats/components/ChartGrid.tsx"));
const StatsGraph = lazy(
	() => import("./pages/stats/layout/graph/StatsGraph.tsx"),
);
const StatsCalendar = lazy(
	() => import("./pages/stats/layout/StatsCalendar.tsx"),
);
const StatsGlobal = lazy(
	() => import("./pages/stats/layout/global/StatsGlobal.tsx"),
);

function ThrowError(): never {
	throw new Error("Deliberate test error from /throw route");
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

// mitigate BE cold starts.
queryClient.prefetchQuery({
	queryKey: HEALTH_QUERY_KEY,
	queryFn: healthQueryFn,
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<AppRoot />
				</QueryClientProvider>
			</BrowserRouter>
		</ClerkProvider>
	</StrictMode>,
);

function AppRoot() {
	const location = useLocation();
	useMultitabSync();

	// controlled via DebugService
	const tree = useDeathLogStore((state) => state.tree);
	useDebug(tree, "[TREE]", tree);

	let status = useDeathLogStore((state) => state.status);
	let loadError = useDeathLogStore((state) => state.loadError);
	const root = useDeathLogStore((state) => state.tree.get("ROOT_NODE"));
	useInitApp();

	if (DebugService.forceDebugCondition(false)) {
		status = "error";
		loadError = new Error("Debug error: forcing to see if view is correct");
	}

	if (status === "error") {
		return (
			<ErrorBoundary
				FallbackComponent={ErrorPage}
				resetKeys={[location.pathname]}
			>
				<Banners />
				<Routes>
					<Route path="/" element={<Start />} />
					<Route
						path="data-management"
						element={<DataManagement />}
					/>
					<Route path="about" element={<About />} />
					<Route path="faq" element={<FAQ />} />
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
			<Banners />
			<Suspense fallback={<Spinner />}>
				<Routes>
					<Route path="/" element={<Start />} />

					<Route path="log">
						<Route index element={<DeathLog parent={root} />} />
						<Route path=":id" element={<DeathLogRouter />} />
					</Route>

					<Route path="stats" element={<StatsDashboard />}>
						<Route index element={<ChartGrid tab="Overview" />} />
						<Route path="global" element={<StatsGlobal />} />
						<Route
							path="specialized"
							element={<ChartGrid tab="Specialized" />}
						/>
						<Route path="graph" element={<StatsGraph />} />
						<Route path="calendar" element={<StatsCalendar />} />
					</Route>

					<Route
						path="data-management"
						element={<DataManagement />}
					/>

					<Route path="user-settings" element={<UserSettings />} />

					<Route path="throw" element={<ThrowError />} />

					<Route path="faq" element={<FAQ />} />

					<Route path="about" element={<About />} />

					<Route
						path="*"
						element={
							<ErrorPage error={new Error(CONSTANTS.ERROR.URL)} />
						}
					/>
				</Routes>
			</Suspense>
		</ErrorBoundary>
	);
}
