import { useState, useEffect } from "react";
import useConsoleLogOnStateChange from "./useConsoleLogOnStateChange";

export default function useMediaQuery(breakpoint: string, onBreakpointChange?: () => void) {
	const [vpMatched, setVPMatched] = useState(matchMedia(breakpoint).matches);
	useEffect(() => {
		const mediaQueryList = matchMedia(breakpoint);
		const listener = (e: MediaQueryListEvent) => {
			if (onBreakpointChange) {
				onBreakpointChange();
			}
			setVPMatched(e.matches);
		};
		mediaQueryList.addEventListener("change", listener);

		return () => mediaQueryList.removeEventListener("change", listener);
	}, [breakpoint]); // dep arr for breakpoint, so HMR works cleanly

	return { vpMatched };
}
