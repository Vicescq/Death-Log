import { useLocation } from "react-router";

export function useActiveNavBarCSS(cssType: "btn" | "bg") {
	const location = useLocation();
	const activeCSS = cssType == "btn" ? "btn-neutral" : "bg-neutral";
	const currRoute = location.pathname.split("/")[1];

	const activeDLCSS = currRoute == "log" ? activeCSS : "";
	const activeStatsCSS = currRoute == "stats" ? activeCSS : "";
	const activeDMCSS = currRoute == "data-management" ? activeCSS : "";
	const activeFAQCSS = currRoute == "faq" ? activeCSS : "";
	const activeAboutCSS = currRoute == "about" ? activeCSS : "";
	const activeUserSettingsCSS = currRoute == "user-settings" ? activeCSS : "";
	return {
		activeDLCSS,
		activeStatsCSS,
		activeDMCSS,
		activeFAQCSS,
		activeAboutCSS,
		activeUserSettingsCSS,
	};
}
