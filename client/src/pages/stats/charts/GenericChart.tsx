import EChartsReact from "react-echarts-library";
import useChartAnimation from "../hooks/useChartAnimation";
import darkerChalk from "../../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../../shared/defaults";
import { StatsQuery } from "../../../services/stats-query/StatsQuery";
import type { Query } from "../../../model/stats-query-model/sql";
import { useMemo, useState } from "react";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import ChartCard from "../components/ChartCard";
import ChartEmpty from "../components/ChartEmpty";
import ChartHideButton from "../components/ChartHideButton";

type Props = {
	preset: Query;
};

export default function GenericChart({ preset }: Props) {
	const [showAnyway, setShowAnyway] = useState(false);
	const tree = useDeathLogStore((state) => state.tree);
	const result = useMemo(() => StatsQuery.run(preset, tree), [preset, tree]);
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
		<ChartCard title={preset.title} settings={settingsContent}>
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
