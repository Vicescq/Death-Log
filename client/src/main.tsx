import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage, { ForceError } from "./pages/ErrorPage.tsx";
import Root from "./pages/Root.tsx";
import Start from "./pages/Start.tsx";
import Utility from "./pages/Utility.tsx";
import MainPageRouter from "./pages/deathLog/DeathLogRouter.tsx";
import DeathCounter from "./pages/deathCounter/DeathCounter.tsx";
import MultipleTabs from "./pages/MultipleTabs.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

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
					<Route path="death-log" element={<MainPageRouter />} />
					<Route path="death-counter" element={<DeathCounter />} />
					<Route path="utility" element={<Utility />} />
					<Route
						path="*"
						element={<ForceError msg={"URL NOT FOUND!"} />}
					/>
				</Route>
				<Route path="/__MULTIPLE_TABS__" element={<MultipleTabs />} />
			</Routes>
		</ErrorBoundary>
	);
}
