import EChartsReact from "react-echarts-library";
import useChartAnimation from "./hooks/useChartAnimation";
import darkerChalk from "../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../shared/defaults";
import {
	StatsQuery,
	type NodeQuery,
} from "../../services/stats-query/StatsQuery";
import { useMemo } from "react";

type Props = {
	query: NodeQuery;
};

export default function GenericChart({ query }: Props) {
	const option = useMemo(() => StatsQuery.query(query), [query]);

	const animatedOption = useChartAnimation(option);

	return (
		<div className="border-base-300 bg-base-200 rounded-2xl border p-2 shadow-lg">
			<EChartsReact
				option={animatedOption}
				theme={darkerChalk}
				style={defaultEchartStyling}
			/>
		</div>
	);
}
