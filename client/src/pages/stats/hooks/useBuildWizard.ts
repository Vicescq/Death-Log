import { useOutletContext } from "react-router";
import type { Dispatch, SetStateAction } from "react";
import type { StatsView } from "../../../model/StatsViewSchema";
import type { ChartSpec } from "../../../model/stats-query-model/chart-spec";

export type ChartDraft = Partial<ChartSpec>;

export type WizardState = {
	templateReady: boolean;
	draft: ChartDraft;
};

export const EMPTY_WIZARD_STATE: WizardState = {
	templateReady: false,
	draft: {},
};

export type BuildContext = {
	allViews: StatsView[];
	wizard: [WizardState, Dispatch<SetStateAction<WizardState>>];
};

export default function useBuildWizard() {
	return useOutletContext<BuildContext>();
}
