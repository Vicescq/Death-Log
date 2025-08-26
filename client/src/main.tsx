import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	BrowserRouter,
	Routes,
	Route,
	useNavigate,
} from "react-router";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage, { ForceError } from "./pages/ErrorPage.tsx";
import Root from "./pages/Root.tsx";
import { ContextWrapper } from "./contexts/ContextWrapper.tsx";
import Start from "./pages/Start/Start.tsx";
import UtilityPage from "./pages/UtilityPage.tsx";
import MainPageRouter from "./pages/MainPageRouter.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<ContextWrapper children={<AppRoutes />} />
		</BrowserRouter>
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
					<Route path="utility" element={<UtilityPage />} />
					<Route
						path="*"
						element={<ForceError msg={"URL NOT FOUND!"} />}
					/>
				</Route>
				<Route />
			</Routes>
		</ErrorBoundary>
	);
}
