import alasql from "alasql";
import type { EChartsOption } from "echarts";
import type {
	ChartSpec,
	SunburstLevel,
	SunburstPrune,
} from "../../model/stats-query-model/chart-spec";
import type {
	CategoryPoint,
	SunburstNode,
} from "../../model/stats-query-model/chart";
import type { Tables } from "./FlattenStage";
import {
	toBarChart,
	toCalendar,
	toLineChart,
	toPieChart,
	toSunburstChart,
	toTimeLineChart,
} from "./ChartStage";

export type QueryResult =
	| { status: "ok"; option: EChartsOption }
	| { status: "no-data" }
	| { status: "insufficient"; minDataPoints: number; option: EChartsOption };

export type RunOptions = {
	calendarRange: string;
};

export function query(
	spec: ChartSpec,
	tables: Tables,
	opts: RunOptions,
): QueryResult {
	const rows = tables[spec.table];
	if (rows.length === 0) return { status: "no-data" };

	if (spec.type === "sunburst") return querySunburst(spec, rows);

	const raw = alasql(spec.sql, [rows]) as { x: unknown; y: unknown }[];
	if (raw.length === 0) return { status: "no-data" };

	let data: CategoryPoint[] = raw.map((r) => ({
		x: String(r.x),
		y: Number(r.y),
	}));
	if (spec.cumulative) data = runningSum(data);

	const option = render(spec, data, opts.calendarRange);

	const threshold = spec.minDataPoints ?? 1;
	if (data.length < threshold)
		return { status: "insufficient", minDataPoints: threshold, option };
	return { status: "ok", option };
}

function runningSum(data: CategoryPoint[]): CategoryPoint[] {
	let running = 0;
	return data.map((p) => ({ ...p, y: (running += p.y) }));
}

function render(
	spec: ChartSpec,
	data: CategoryPoint[],
	range: string,
): EChartsOption {
	switch (spec.type) {
		case "bar":
			return toBarChart(data);
		case "line":
			return toLineChart(data);
		case "pie":
			return toPieChart(data);
		case "time-line":
			return toTimeLineChart(data);
		case "calendar":
			return toCalendar(data, range);
		case "sunburst":
			throw new Error(
				"[DEV] sunburst is handled by runSunburst, not render",
			);
	}
}

function querySunburst(spec: ChartSpec, rows: unknown[]): QueryResult {
	const levels = spec.levels;
	if (!levels || levels.length === 0)
		throw new Error(
			"[DEV] sunburst spec requires a non-empty levels array",
		);

	const result = alasql(spec.sql, [rows]) as Record<string, unknown>[];
	if (result.length === 0) return { status: "no-data" };

	const tree = applySunburstPrune(
		rowsToSunburst(result, levels.length),
		levels,
	);
	const option = toSunburstChart(tree);

	const threshold = spec.minDataPoints ?? 1;
	if (result.length < threshold)
		return { status: "insufficient", minDataPoints: threshold, option };
	return { status: "ok", option };
}

function rowsToSunburst(
	rows: Record<string, unknown>[],
	depth: number,
): SunburstNode[] {
	const roots: SunburstNode[] = [];
	for (const row of rows) {
		const y = Number(row.y);
		let siblings = roots;
		for (let level = 0; level < depth; level++) {
			const name = String(row[`l${level}`]);
			let node = siblings.find((n) => n.name === name);
			if (!node) {
				node = { name, value: 0, children: [] };
				siblings.push(node);
			}
			node.value += y;
			siblings = node.children;
		}
	}
	return roots;
}

function applySunburstPrune(
	tree: SunburstNode[],
	levels: SunburstLevel[],
): SunburstNode[] {
	const total = tree.reduce((sum, n) => sum + n.value, 0);
	return pruneAtLevel(tree, total, levels, 0);
}

type KeepResult = { kept: SunburstNode[]; dropped: SunburstNode[] };

function keepGreedy(
	siblings: SunburstNode[],
	parentValue: number,
	prune: SunburstPrune,
): KeepResult {
	const n = prune.mode === "threshold" ? Infinity : prune.topN;
	const pct = prune.mode === "topN" ? Infinity : prune.threshold;
	const sorted = [...siblings].sort((a, b) => b.value - a.value);
	const target = parentValue * pct;
	const kept: SunburstNode[] = [];
	let cumulative = 0;
	let i = 0;
	for (; i < sorted.length; i++) {
		if (kept.length >= n) break;
		if (cumulative + sorted[i].value > target) break;
		kept.push(sorted[i]);
		cumulative += sorted[i].value;
	}
	return { kept, dropped: sorted.slice(i) };
}

function pruneAtLevel(
	siblings: SunburstNode[],
	parentValue: number,
	levels: SunburstLevel[],
	depth: number,
): SunburstNode[] {
	const prune = levels[depth]?.prune;
	const { kept, dropped } = prune
		? keepGreedy(siblings, parentValue, prune)
		: { kept: siblings, dropped: [] as SunburstNode[] };
	const recursed = kept.map((node) =>
		node.children.length > 0
			? {
					...node,
					children: pruneAtLevel(
						node.children,
						node.value,
						levels,
						depth + 1,
					),
				}
			: node,
	);
	if (dropped.length === 0 || prune?.showOther === false) return recursed;
	const otherValue = dropped.reduce((sum, n) => sum + n.value, 0);
	return [...recursed, { name: "Other", value: otherValue, children: [] }];
}
