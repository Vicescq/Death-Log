import { useOutletContext } from "react-router";
import type { StatsView } from "../../../model/StatsViewSchema";

export type StatsViewState = {
	defaultViews: StatsView[];
	customViews: StatsView[];
	currEditingView: StatsView | null;
	activeViewId: string;
};

type StatsViewContext = [
	StatsViewState,
	React.Dispatch<React.SetStateAction<StatsViewState>>,
];

export default function useStatsViews() {
	return useOutletContext<StatsViewContext>();
}
