import { useState } from "react";
import { Outlet } from "react-router";
import useStatsViews from "../hooks/useStatsViews";
import BuildSteps from "./BuildSteps";
import { EMPTY_WIZARD_STATE } from "../hooks/useBuildWizard";
import type { BuildContext, WizardState } from "../hooks/useBuildWizard";

export default function StatsBuild() {
	const [viewsContext] = useStatsViews();
	const wizard = useState<WizardState>(EMPTY_WIZARD_STATE);
	const [wizardState] = wizard;

	const context: BuildContext = {
		allViews: [...viewsContext.defaultViews, ...viewsContext.customViews],
		wizard,
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">Build a Chart</h2>
				<BuildSteps />
			</div>
			<Outlet context={context} />
			{wizardState.templateReady && (
				<div className="border-base-300 bg-accent/5 rounded-lg border px-4 py-3">
					<span className="text-sm opacity-80">
						Switching to another tab (Overview, Manage) or leaving
						this page will discard your progress.
					</span>
				</div>
			)}
		</div>
	);
}
