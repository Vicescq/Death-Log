import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage.tsx";
import Start from "./pages/Start.tsx";
import DataManagement from "./pages/data-management/DataManagement.tsx";
import MultipleTabs from "./pages/MultipleTabs.tsx";
import { ClerkProvider } from "@clerk/react";
import DeathLog from "./pages/death-log/DeathLog.tsx";
import FAQ from "./pages/faq/FAQ.tsx";
import About from "./pages/about/About.tsx";
import UserSettings from "./pages/user-settings/UserSettings.tsx";
import { useDeathLogStore } from "./stores/useDeathLogStore.ts";
import useInitApp from "./hooks/useInitApp.ts";
import useConsoleLogOnStateChange from "./hooks/useConsoleLogOnStateChange.ts";
import useMultipleTabsWarning from "./hooks/useMultipleTabsWarning.ts";
import { CONSTANTS } from "../shared/constants.ts";
import DeathLogRouter from "./pages/death-log/DeathLogRouter.tsx";
import StatsDashboard from "./pages/stats/layout/StatsDashboard.tsx";
import ChartGrid from "./pages/stats/components/ChartGrid.tsx";
import SharedChartGrid from "./pages/stats/components/SharedChartGrid.tsx";
import BrowseProfiles from "./pages/stats/layout/BrowseProfiles.tsx";
import FollowList from "./pages/stats/layout/FollowList.tsx";
import StatsGraph from "./pages/stats/layout/StatsGraph.tsx";
import PopularProfiles from "./pages/stats/layout/PopularProfiles.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HEALTH_QUERY_KEY, healthQueryFn } from "./services/healthQuery.ts";
import FakeDataBanner from "./components/FakeDataBanner.tsx";
import ReloadPrompt from "./components/ReloadPrompt.tsx";

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
	useMultipleTabsWarning();
	// const tree = useDeathLogStore((state) => state.tree);
	// useConsoleLogOnStateChange(tree, "TREE:", tree);
	let status = useDeathLogStore((state) => state.status);
	let loadError = useDeathLogStore((state) => state.loadError);
	const root = useDeathLogStore((state) => state.tree.get("ROOT_NODE"));
	useInitApp();

	// Debug vars
	// status = "error";
	// loadError = new Error("Debug error: forcing to see if view is correct");

	if (status === "error") {
		return (
			<ErrorBoundary
				FallbackComponent={ErrorPage}
				resetKeys={[location.pathname]}
			>
				<ReloadPrompt />
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
			<FakeDataBanner />
			<ReloadPrompt />
			<Routes>
				<Route path="/" element={<Start />} />

				<Route path="log">
					<Route index element={<DeathLog parent={root} />} />
					<Route path=":id" element={<DeathLogRouter />} />
				</Route>

				<Route path="stats" element={<StatsDashboard />}>
					<Route index element={<ChartGrid tab="Overview" />} />
					<Route
						path="specialized"
						element={<ChartGrid tab="Specialized" />}
					/>
					<Route path="graph" element={<StatsGraph />} />
					<Route
						path="browse-profiles"
						element={<BrowseProfiles />}
					/>
				</Route>

				<Route
					path="stats/popular-profiles"
					element={<PopularProfiles />}
				/>

				<Route
					path="profiles/:username/stats"
					element={<StatsDashboard isSharedPage />}
				>
					<Route index element={<SharedChartGrid tab="Overview" />} />
					<Route
						path="specialized"
						element={<SharedChartGrid tab="Specialized" />}
					/>
					<Route path="graph" element={<StatsGraph />} />
					<Route
						path="browse-profiles"
						element={<BrowseProfiles />}
					/>
				</Route>

				<Route
					path="profiles/:username/followers"
					element={<FollowList mode="followers" />}
				/>
				<Route
					path="profiles/:username/following"
					element={<FollowList mode="following" />}
				/>

				<Route path="data-management" element={<DataManagement />} />

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

				<Route path="/__MULTIPLE_TABS__" element={<MultipleTabs />} />
			</Routes>
		</ErrorBoundary>
	);
}
