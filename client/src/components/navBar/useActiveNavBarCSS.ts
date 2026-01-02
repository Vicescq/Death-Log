import { useLocation } from "react-router";

export function useActiveNavBarCSS(cssType: "btn" | "bg") {
    const location = useLocation();
    const activeCSS = cssType == "btn" ? "btn-neutral" : "bg-neutral";
    const currRoute = location.pathname.split("/")[1];

    const activeDLCSS = currRoute == "log" ? activeCSS : "";
    const activeDMCSS = currRoute == "data-management" ? activeCSS : "";
    const activeFAQCSS = currRoute == "FAQ" ? activeCSS : "";
    return { activeDLCSS, activeDMCSS, activeFAQCSS }
}