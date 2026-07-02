import { useStatsContext } from "../hooks/useStatsContext";
import SharedChartSlotRenderer from "./SharedChartSlotRenderer";
import Spinner from "../../../components/Spinner";
import StatsErrorMessage from "../../../components/StatsErrorMessage";
import type { ChartTab } from "../../../model/stats-query-model/tabs";

export default function SharedChartGrid({ tab }: { tab: ChartTab }) {
	const ctx = useStatsContext();
	if (!ctx.isSharedPage) return null;

	if (ctx.status === "loading") {
		return <Spinner />;
	}

	if (ctx.status === "error") {
		return <StatsErrorMessage message="Could not load this profile." />;
	}

	const slots = ctx.profile?.chartSlots.filter((s) => s.tab === tab) ?? [];

	if (slots.length === 0) {
		return (
			<div className="border-base-300 rounded-lg py-16 text-center">
				No charts on this tab.
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
			{slots.map((slot) => (
				<SharedChartSlotRenderer key={slot.id} slot={slot} />
			))}
		</div>
	);
}
