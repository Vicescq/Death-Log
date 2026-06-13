import EChartsReact from "react-echarts-library";
import useChartAnimation from "./hooks/useChartAnimation";
import darkerChalk from "../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../shared/defaults";
import { StatsQuery } from "../../services/stats-query/StatsQuery";
import type { DeathQuery } from "../../services/stats-query/types/death-query";
import { useMemo, useState } from "react";
import ChartCard from "./ChartCard";
import ReliabilityToggle, { type ReliabilityFlag } from "./ReliabilityToggle";

type Props = {
	query: DeathQuery;
};

export default function GenericDeathChart({ query: initialQuery }: Props) {
	const [query, setQuery] = useState(initialQuery);
	const option = useMemo(() => StatsQuery.query(query), [query]);
	const animatedOption = useChartAnimation(option);

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
			actions={<ReliabilityToggle flags={flags} />}
		>
			<EChartsReact
				option={animatedOption}
				theme={darkerChalk}
				style={defaultEchartStyling}
			/>
		</ChartCard>
	);
}
