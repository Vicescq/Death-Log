import { createContext, useContext } from "react";
import type { Tables } from "../../../model/stats-query-model/chart";
import type { SharedProfileView } from "../../../model/stats-query-model/shared-charts";

export type VisitorStatus = "loading" | "ready" | "notfound" | "error";

type BaseView = {
	username: string;
	status: VisitorStatus;
	profile: SharedProfileView | null;
};

type LocalView = BaseView & {
	isSharedPage: false;
	tables: Tables;
};

type SharedView = BaseView & {
	isSharedPage: true;
};

export type StatsContextState = LocalView | SharedView;

export const StatsContext = createContext<StatsContextState | null>(null);

export function useStatsContext(): StatsContextState {
	const context = useContext(StatsContext);
	if (context === null)
		throw new Error(
			"DEV ERROR! useStatsContext must be used within a Provider!",
		);
	return context;
}
