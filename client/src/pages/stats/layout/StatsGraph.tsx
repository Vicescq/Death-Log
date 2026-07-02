import { useMemo } from "react";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import type { Graph } from "../../../model/stats-query-model/chart";
import ChartCanvas from "../components/ChartCanvas";

const STUB_GRAPH: Graph = {
	categories: [{ name: "Games" }, { name: "Subjects" }],
	nodes: [
		{
			id: "g1",
			name: "Elden Ring",
			value: 42,
			symbolSize: 50,
			category: 0,
		},
		{ id: "g2", name: "Sekiro", value: 30, symbolSize: 30, category: 0 },
		{ id: "s1", name: "Malenia", value: 20, symbolSize: 20, category: 1 },
		{ id: "s2", name: "Radahn", value: 12, symbolSize: 12, category: 1 },
		{ id: "s3", name: "Isshin", value: 18, symbolSize: 18, category: 1 },
		{ id: "s4", name: "Genichiro", value: 10, symbolSize: 10, category: 1 },
	],
	edges: [
		{ id: "e1", source: "g1", target: "s1" },
		{ id: "e2", source: "g1", target: "s2" },
		{ id: "e3", source: "g2", target: "s3" },
		{ id: "e4", source: "g2", target: "s4" },
	],
};

export default function StatsGraph() {
	const option = useMemo(
		() => StatsPipeline.Chart({ mode: "graph", graph: STUB_GRAPH }),
		[],
	);

	return (
		<div className="h-screen">
			<ChartCanvas title="Graph" option={option} hideMenu />
		</div>
	);
}
