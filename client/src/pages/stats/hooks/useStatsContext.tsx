import { createContext, useContext } from "react";
import type { Tables } from "../../../model/stats-query-model/chart";

export type StatsContextState = {
	tables: Tables;
	isSharedPage?: boolean;
};

export const StatsContext = createContext<StatsContextState | null>(null);

export function useStatsContext(): StatsContextState {
	const context = useContext(StatsContext);
	if (context === null)
		throw new Error(
			"DEV ERROR! useStatsContext must be used within a Provider!",
		);
	return context;
}
