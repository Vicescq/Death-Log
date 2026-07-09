import { useStatsContext } from "../hooks/useStatsContext";
import SharedChartSlotRenderer from "./SharedChartSlotRenderer";
import Spinner from "../../../components/Spinner";
import StatsErrorMessage from "../../../components/StatsErrorMessage";
import type { ChartTab } from "../../../model/stats-query-model/tabs";
import useOnlineStatus from "../../../hooks/useOnlineStatus";

export default function SharedChartGrid({ tab }: { tab: ChartTab }) {
	const ctx = useStatsContext();
	const isOnline = useOnlineStatus();

	if (!ctx.isSharedPage) return null;

	if (!isOnline) {
		return (
			<StatsErrorMessage message="You have to be online to view shared profiles!" />
		);
	}

	if (ctx.status === "loading") {
		return <Spinner />;
	}

	if (ctx.status === "error") {
		return <StatsErrorMessage message="Could not load this profile." />;
	}

	const slots = ctx.profile?.chartSlots.filter((s) => s.tab === tab) ?? [];

	if (slots.length === 0) {
		return (
			<StatsErrorMessage message="This profile has no charts in this tab!" />
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
