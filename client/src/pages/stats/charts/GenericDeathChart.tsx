import EChartsReact from "react-echarts-library";
import useChartAnimation from "../hooks/useChartAnimation";
import darkerChalk from "../../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../../shared/defaults";
import { StatsQuery } from "../../../services/stats-query/StatsQuery";
import type { DeathQuery } from "../../../model/stats-query-model/death-query";
import { useMemo, useState } from "react";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import ChartCard from "../components/ChartCard";
import ChartEmpty from "../components/ChartEmpty";
import ChartHideButton from "../components/ChartHideButton";
import ReliabilityToggle, { type ReliabilityFlag } from "../components/ReliabilityToggle";

type Props = {
	query: DeathQuery;
};

export default function GenericDeathChart({ query: initialQuery }: Props) {
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

	const flags: ReliabilityFlag[] = [
		{
			label: "Unreliable data",
			value: query.filter.unreliableTimestamp,
			onToggle: () =>
				setQuery((q) => ({
					...q,
					filter: {
						...q.filter,
						unreliableTimestamp: !q.filter.unreliableTimestamp,
					},
				})),
		},
	];

	return (
		<ChartCard
			title={query.title}
			settings={
				<>
					<ReliabilityToggle flags={flags} />
					<ChartHideButton
						visible={result.status === "insufficient" && showAnyway}
						onHide={() => setShowAnyway(false)}
					/>
				</>
			}
		>
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

					onShowAnyway={() => setShowAnyway(true)}
				/>
			)}
		</ChartCard>
	);
}
