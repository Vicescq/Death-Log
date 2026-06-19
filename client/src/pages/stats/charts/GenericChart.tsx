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

type Props = {
	initQuery: Query;
};

export default function GenericChart({ initQuery }: Props) {
	const [showAnyway, setShowAnyway] = useState(false);
	const tree = useDeathLogStore((state) => state.tree);
	const result = useMemo(
		() => StatsQuery.run(initQuery, tree),
		[initQuery, tree],
	);
	const animatedOption = useChartAnimation(
		result.status !== "no-data" ? result.option : {},
	);

	const showChart =
		result.status === "ok" ||
		(result.status === "insufficient" && showAnyway);

	const settingsContent =
		result.status === "insufficient" && showAnyway ? (
			<ChartHideButton visible onHide={() => setShowAnyway(false)} />
		) : undefined;

	return (
		<ChartCard title={initQuery.title} settings={settingsContent}>
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
