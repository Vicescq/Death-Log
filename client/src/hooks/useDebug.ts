import { useEffect } from "react";
import { DebugService } from "../services/DebugService";

export default function useDebug(state: unknown, ...loggedVal: unknown[]) {
	useEffect(() => {
		DebugService.log(...loggedVal);
	}, [state]);
}
