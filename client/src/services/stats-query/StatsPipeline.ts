import type { EChartsOption } from "echarts";
import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { ChartData } from "../../model/stats-query-model/chart";
import type { Query } from "../../model/stats-query-model/query";
import { CollectionStage } from "./CollectionStage";
import { ChartStage } from "./ChartStage";

/**
 * Minimal wrapper. Main purpose is to provide a facade for the pipeline feature
 */
export class StatsPipeline {
	static Collect(query: Query, tree: Tree): ChartData {
		return CollectionStage.collect(query, tree);
	}

	static Chart(query: Query, data: ChartData): EChartsOption | null {
		if (query.chartType === "calendar") {
			return ChartStage.render(query.chartType, data, {
				range: query.range,
				cellSize: query.cellSize,
			});
		}
		if (query.chartType === "graph") {
			return ChartStage.render(query.chartType, data, undefined, {
				draggable: query.draggable,
				zoom: query.zoom,
				showLabels: query.showLabels,
			});
		}
		return ChartStage.render(query.chartType, data);
	}
}
