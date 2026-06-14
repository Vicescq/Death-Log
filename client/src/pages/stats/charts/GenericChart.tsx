import EChartsReact from "react-echarts-library";
import useChartAnimation from "../hooks/useChartAnimation";
import darkerChalk from "../../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../../shared/defaults";
import { StatsQuery } from "../../../services/stats-query/StatsQuery";
import type { NodeQuery } from "../../../services/stats-query/types/node-query";
import { useMemo, useState } from "react";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import ChartCard from "../components/ChartCard";
import ChartEmpty from "../components/ChartEmpty";
import ChartHideButton from "../components/ChartHideButton";
import ReliabilityToggle, {
	type ReliabilityFlag,
} from "../components/ReliabilityToggle";

type Props = {
	query: NodeQuery;
};

export default function GenericChart({ query: initialQuery }: Props) {
	const [query, setQuery] = useState(initialQuery);
	const [showAnyway, setShowAnyway] = useState(false);
	const tree = useDeathLogStore((state) => state.tree);
	const result = useMemo(() => StatsQuery.query(query, tree), [query, tree]);
	const animatedOption = useChartAnimation(
		result.status !== "no-data" ? result.option : {},
	);

	const showChart =
		result.status === "ok" ||
		(result.status === "insufficient" && showAnyway);

	const isDateChart = query.extract === "nodeTimeline";

	const flags: ReliabilityFlag[] = isDateChart
		? [
				{
					label: "Show Unreliable data",
					value:
						query.filter.unreliableStart &&
						query.filter.unreliableEnd,
					onToggle: () =>
						setQuery((q) => {
							const next = !(
								q.filter.unreliableStart &&
								q.filter.unreliableEnd
							);
							return {
								...q,
								filter: {
									...q.filter,
									unreliableStart: next,
									unreliableEnd: next,
								},
							};
						}),
				},
			]
		: [];

	const hasHideButton = result.status === "insufficient" && showAnyway;
	const settingsContent =
		flags.length > 0 || hasHideButton ? (
			<>
				<ReliabilityToggle flags={flags} />
				<ChartHideButton
					visible={hasHideButton}
					onHide={() => setShowAnyway(false)}
				/>
			</>
		) : undefined;

	return (
		<ChartCard title={query.title} settings={settingsContent}>
			{showChart ? (
				<EChartsReact
					option={animatedOption}
					theme={darkerChalk}
					style={defaultEchartStyling}
				/>
			) : result.status === "no-data" ? (
				<ChartEmpty status="no-data" />
			) : (
				<ChartEmpty
					status="insufficient"
					minDataPoints={result.minDataPoints}
					onShowAnyway={() => setShowAnyway(true)}
				/>
			)}
		</ChartCard>
	);
}
