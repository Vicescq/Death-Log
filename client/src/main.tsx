import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage.tsx";
import Root from "./pages/Root.tsx";
import Start from "./pages/Start.tsx";
import DataManagement from "./pages/DataManagement.tsx";
import DeathLogRouter from "./pages/deathLog/DeathLogRouter.tsx";
import MultipleTabs from "./pages/MultipleTabs.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import DeathLog from "./pages/deathLog/DeathLog.tsx";
import FAQ from "./pages/FAQ.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</ClerkProvider>
	</StrictMode>,
);

function ErrorBoundaryTest() {
	throw new Error("testtesttesttesttesttest");
	return <></>;
}

function AppRoutes() {
	let navigate = useNavigate();

	return (
		<ErrorBoundary
			FallbackComponent={ErrorPage}
			onReset={() => navigate("/")}
		>
			<Routes>
				<Route path="/" element={<Root />}>
					<Route index element={<Start />} />

					<Route
						path="log"
						element={
							<DeathLog
								type="game"
								parentID="ROOT_NODE"
								key="ROOT_NODE"
							/>
						}
					/>
					<Route path="log/:gameID/" element={<DeathLogRouter />} />
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
							<ErrorPage error={new Error("URL not found!")} />
						}
					/>
				</Route>
				<Route path="/__MULTIPLE_TABS__" element={<MultipleTabs />} />
			</Routes>
		</ErrorBoundary>
	);
}
