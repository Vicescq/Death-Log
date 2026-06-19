import alasql from "alasql";
import type {
	Tree,
	DistinctTreeNode,
} from "../../model/tree-node-model/TreeNodeSchema";
import type { Query, QueryResult } from "../../model/stats-query-model/query";
import { flattenTree, type DeathRow, type Tables } from "./FlattenStage";
import { calcDeaths } from "../../pages/death-log/utils";
import {
	toBarChart,
	toLineChart,
	toTimeLineChart,
	toHeatMapCalendar,
	toPieChart,
	toSunburstChart,
} from "./ChartStage";
import type {
	CategoryPoint,
	SunburstNode,
} from "../../model/stats-query-model/chart";

export class StatsQuery {
	static run(query: Query, tree: Tree): QueryResult {
		const tables = flattenTree(tree);
		const deaths = this.resolveUnreliableDeaths(tables.deaths, query);

		switch (query.case) {
			case "flat":      return this.runSql(query, tables, deaths);
			case "hierarchy": return this.runHierarchy(query, tree);
		}
	}

	private static runSql(
		query: Extract<Query, { case: "flat" }>,
		tables: Tables,
		deaths: DeathRow[],
	): QueryResult {
		const rows_src = query.from === "subjects" ? tables.subjects : deaths;
		if (rows_src.length === 0) return { status: "no-data" };
		const rows = alasql(query.sql, [rows_src]) as { x: string; y: number }[];
		if (rows.length === 0) return { status: "no-data" };

		let data: CategoryPoint[] = rows.map((r) => ({
			x: String(r.x),
			y: Number(r.y),
		}));

		if (query.transform === "cumulative") {
			let running = 0;
			data = data.map((r) => ({ x: r.x, y: (running += r.y) }));
		}

		if (query.transform === "calendar") {
			const bySubjectDay = alasql(
				"SELECT date, subjectName, COUNT(*) as cnt FROM ? GROUP BY date, subjectName",
				[deaths],
			) as { date: string; subjectName: string; cnt: number }[];
			const subjectsByDay: Record<string, Record<string, number>> = {};
			for (const row of bySubjectDay) {
				subjectsByDay[row.date] ??= {};
				subjectsByDay[row.date][row.subjectName] = row.cnt;
			}
			data = data.map(({ x, y }) => {
				const subjects = subjectsByDay[x] ?? {};
				const meta = Object.entries(subjects)
					.map(([name, n]) => `${name}: ${n}/${y}`)
					.join(", ");
				return { x, y, meta };
			});
		}

		const threshold = query.minDataPoints ?? 1;

		let option;
		switch (query.chartType) {
			case "bar":      option = toBarChart(data, query.echartsConfig); break;
			case "line":     option = toLineChart(data); break;
			case "time-line": option = toTimeLineChart(data); break;
			case "pie":      option = toPieChart(data); break;
			case "calendar": option = toHeatMapCalendar(data, query.echartsConfig); break;
		}

		if (data.length < threshold)
			return { status: "insufficient", minDataPoints: threshold, option };
		return { status: "ok", option };
	}

	private static runHierarchy(
		query: Extract<Query, { case: "hierarchy" }>,
		tree: Tree,
	): QueryResult {
		const selectedGames = [...tree.values()]
			.filter((n): n is DistinctTreeNode => n.type === "game")
			.sort((a, b) => calcDeaths(b, tree) - calcDeaths(a, tree))
			.slice(0, 5);

		if (selectedGames.length === 0) return { status: "no-data" };

		const data: SunburstNode[] = selectedGames.map((g) =>
			this.buildSunburstNode(
				g,
				tree,
				0,
				query.topN,
				query.threshold,
				query.maxDepth,
			),
		);

		const threshold = query.minDataPoints ?? 1;
		const option = toSunburstChart(data);
		if (selectedGames.length < threshold)
			return { status: "insufficient", minDataPoints: threshold, option };
		return { status: "ok", option };
	}

	private static buildSunburstNode(
		node: DistinctTreeNode,
		tree: Tree,
		depth: number,
		topN: number,
		threshold: number,
		maxDepth: number,
	): SunburstNode {
		if (depth + 1 >= maxDepth) {
			return { name: node.name, value: calcDeaths(node, tree) };
		}

		const allChildren = node.childIDS
			.map((id) => tree.get(id))
			.filter((c): c is DistinctTreeNode => c !== undefined)
			.sort((a, b) => calcDeaths(b, tree) - calcDeaths(a, tree));

		const total = calcDeaths(node, tree);
		const selected: DistinctTreeNode[] = [];
		let running = 0;
		for (const child of allChildren) {
			if (selected.length >= topN) break;
			selected.push(child);
			running += calcDeaths(child, tree);
			if (total > 0 && running / total >= threshold) break;
		}

		const children = selected.map((c) =>
			this.buildSunburstNode(
				c,
				tree,
				depth + 1,
				topN,
				threshold,
				maxDepth,
			),
		);
		return {
			name: node.name,
			value: total,
			...(children.length > 0 ? { children } : {}),
		};
	}

	private static resolveUnreliableDeaths(
		rows: DeathRow[],
		query: Query,
	): DeathRow[] {
		return query.includeUnreliableTimestamp === false
			? rows.filter((d) => d.timestampRel)
			: rows;
	}
}
