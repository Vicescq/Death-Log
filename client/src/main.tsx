import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	BrowserRouter,
	Routes,
	Route,
	useNavigate,
	HashRouter,
} from "react-router";
import "./index.css";
import GamesPage from "./pages/GamesPage/GamesPage.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage, { ForceError } from "./pages/ErrorPage.tsx";
import Root from "./pages/Root.tsx";
import URLRouter from "./components/URLRouter.tsx";
import { ContextWrapper } from "./contexts/ContextWrapper.tsx";
import Start from "./pages/Start.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HashRouter>
			<ContextWrapper children={<AppRoutes />} />
		</HashRouter>
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
					<Route path="death-log" element={<GamesPage />} />
					<Route path="death-log/:gameName" element={<URLRouter />} />
					<Route
						path="death-log/:gameName/:profileName"
						element={<URLRouter />}
					/>
					<Route
						path="death-log/:gameName/:profileName/*"
						element={<ForceError msg={"URL NOT FOUND!"} />}
					/>
				</Route>
				<Route />
			</Routes>
		</ErrorBoundary>
	);
}
