import type { EChartsOption } from "echarts";
import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { ChartSpec } from "../../model/stats-query-model/chart-spec";
import type {
	ChartData,
	ChartSlot,
	Tables,
} from "../../model/stats-query-model/chart";
import type { SharedChartSlot } from "../../model/stats-query-model/shared-charts";
import { OverrideStage } from "./OverrideStage";
import { FlattenStage } from "./FlattenStage";
import { QueryStage } from "./QueryStage";
import { ChartStage } from "./ChartStage";
import { SharingStage } from "./SharingStage";

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

	static Chart(
		spec: ChartSpec,
		data: ChartData,
		range: string,
	): EChartsOption | null {
		return ChartStage.render(spec, data, range);
	}

	static Share(slot: ChartSlot, data: ChartData): SharedChartSlot {
		return SharingStage.toSlot(slot, data);
	}
}
