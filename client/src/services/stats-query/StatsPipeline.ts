import type { EChartsOption } from "echarts";
import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { ChartSpec } from "../../model/stats-query-model/chart-spec";
import type {
	ChartData,
	ChartSlot,
	Graph,
	Tables,
} from "../../model/stats-query-model/chart";
import type {
	SharedChartSlot,
	SharedChartSpec,
} from "../../model/stats-query-model/shared-charts";
import { OverrideStage } from "./OverrideStage";
import { FlattenStage } from "./FlattenStage";
import { QueryStage } from "./QueryStage";
import { ChartStage } from "./ChartStage";
import { SharingStage } from "./SharingStage";

type ChartInput =
	| { mode?: "local"; spec: ChartSpec; data: ChartData; range: string }
	| { mode: "sharing"; spec: SharedChartSpec; range: string }
	| { mode: "graph"; graph: Graph };

export class StatsPipeline {
	static Flatten(tree: Tree): Tables {
		return FlattenStage.flatten(tree);
	}

	static Override(id: string, spec: ChartSpec): ChartSpec {
		return OverrideStage.resolve(id, spec);
	}

	static Query(spec: ChartSpec, tables: Tables): ChartData {
		return QueryStage.query(spec, tables);
	}

	static Chart(input: ChartInput): EChartsOption | null {
		if (input.mode === "sharing")
			return ChartStage.renderShared(input.spec, input.range);
		if (input.mode === "graph") return ChartStage.renderGraph(input.graph);
		return ChartStage.render(input.spec, input.data, input.range);
	}

	static Share(slot: ChartSlot, data: ChartData): SharedChartSlot {
		return SharingStage.toSlot(slot, data);
	}
}
