import EChartsReact from "react-echarts-library";
import useChartAnimation from "../hooks/useChartAnimation";
import darkerChalk from "../../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../../shared/defaults";
import { StatsQuery } from "../../../services/stats-query/StatsQuery";
import type { Query } from "../../../model/stats-query-model/query";
import { useMemo, useState } from "react";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import ChartCard from "../components/ChartCard";
import ChartEmpty from "../components/ChartEmpty";
import ChartHideButton from "../components/ChartHideButton";
import ReliabilityToggle, {
	type ReliabilityFlag,
} from "../components/ReliabilityToggle";

type Props = {
	initQuery: Extract<Query, { case: "flat" }>;
};

export default function GenericDeathChart({ initQuery }: Props) {
	const [query, setQuery] = useState(initQuery);
	const [showAnyway, setShowAnyway] = useState(false);
	const tree = useDeathLogStore((state) => state.tree);
	const result = useMemo(() => StatsQuery.run(query, tree), [query, tree]);
	const animatedOption = useChartAnimation(
		result.status !== "no-data" ? result.option : {},
	);

	const showChart =
		result.status === "ok" ||
		(result.status === "insufficient" && showAnyway);

	const flags: ReliabilityFlag[] = [
		{
			label: "Unreliable data",
			value: query.includeUnreliableTimestamp ?? true,
			onToggle: () =>
				setQuery((p) => ({
					...p,
					includeUnreliableTimestamp: !(
						p.includeUnreliableTimestamp ?? true
					),
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
